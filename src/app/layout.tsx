import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";

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
        {/*
          Provider order is MANDATORY:
          1. LenisProvider — initializes smooth scroll + GSAP ticker
          2. CursorProvider — cursor variant context (NOT position)
          3. AnimationProvider — added in plan 03 (preloader gate)
          Reversing any two breaks the dependency chain.
        */}
        <LenisProvider>
          <CursorProvider>
            {/* AnimationProvider + Navigation + CustomCursor injected in plan 03 */}
            {children}
          </CursorProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
