import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";

const sohneBreit = localFont({
  src: [
    {
      path: "../../public/fonts/TestSohneBreit-Buch.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TestSohneBreit-Dreiviertelfett.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sohne-breit",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Maje Concept — Impression & Marquage Textile Premium",
  description:
    "Spécialiste du print et marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage — pour entreprises, institutionnels et associations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={sohneBreit.variable}>
      <body className="bg-brand-black text-brand-cream font-display antialiased">
        <LenisProvider>
          <CursorProvider>
            {/* CustomCursor must be inside CursorProvider (consumes useCursor hook) */}
            <CustomCursor />
            {/* AnimationProvider + Navigation injected in plan 03 */}
            {children}
          </CursorProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
