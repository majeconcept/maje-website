import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
          Provider stack injecté par les plans suivants:
          LenisProvider → CursorProvider → AnimationProvider → Navigation + CustomCursor + children
          Ne pas modifier l'ordre.
        */}
        {children}
      </body>
    </html>
  );
}
