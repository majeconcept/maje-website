import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations";
import { NotificationEmail } from "@/components/emails/NotificationEmail";
import { ConfirmationEmail } from "@/components/emails/ConfirmationEmail";

export const runtime = "edge";

// In-memory rate limiting — each Edge Worker instance is isolated, so this
// provides best-effort protection within a single instance (no setInterval needed)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // 1. Rate limiting by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  // 2. Parse + server-side validation (never trust client)
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide" },
      { status: 400 }
    );
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const data = parsed.data;

  // 3. Honeypot check — return fake success to not reveal detection
  if (data.website) {
    return NextResponse.json({ success: true });
  }

  // 4. Send notification email to Maje Concept
  // Use onboarding@resend.dev in dev (no domain verification needed)
  // Switch to noreply@maje-concept.fr after domain verification in Resend dashboard
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress =
    process.env.RESEND_FROM_ADDRESS ?? "onboarding@resend.dev";
  const toAddress = process.env.CONTACT_EMAIL ?? "contact@maje-concept.fr";

  const { error: notifError } = await resend.emails.send({
    from: `Site Maje Concept <${fromAddress}>`,
    to: [toAddress],
    subject: `Nouvelle demande de devis — ${data.firstName} ${data.lastName}`,
    react: NotificationEmail({ data }),
  });

  if (notifError) {
    console.error("Resend notification error:", notifError);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }

  // 5. Send confirmation email to prospect (non-blocking failure — don't 500 if this fails)
  const { error: confirmError } = await resend.emails.send({
    from: `Maje Concept <${fromAddress}>`,
    to: [data.email],
    subject: "Votre demande de devis a bien été reçue — Maje Concept",
    react: ConfirmationEmail({ firstName: data.firstName }),
  });

  if (confirmError) {
    console.error("Resend confirmation error:", confirmError);
    // Don't fail the request — notification was sent, confirmation is secondary
  }

  return NextResponse.json({ success: true });
}
