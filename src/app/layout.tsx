import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { AnimationProvider } from "@/components/providers/AnimationProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Navigation } from "@/components/navigation/Navigation";

const polly = localFont({
  src: [
    {
      path: "../../public/fonts/Polly-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Polly-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Polly-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Polly-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-polly",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://maje-concept.fr"
  ),

  title: {
    default: "Maje Concept — Impression & Marquage Textile Premium en Alsace",
    template: "%s | Maje Concept",
  },
  description:
    "Spécialiste du print et marquage textile en Alsace depuis 2019. Sérigraphie, broderie, DTF, flocage — pour entreprises, institutionnels et associations. Devis gratuit.",

  keywords: [
    "marquage textile",
    "impression textile Alsace",
    "sérigraphie Colmar",
    "broderie personnalisée",
    "DTF flocage",
    "vêtements professionnels",
    "print textile Alsace",
  ],

  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Maje Concept",
    title: "Maje Concept — Impression & Marquage Textile Premium",
    description:
      "Votre spécialiste du marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage pour entreprises et associations.",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maje Concept — Print & Marquage Textile Premium en Alsace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Maje Concept — Impression & Marquage Textile Premium",
    description:
      "Spécialiste du marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "Maje Concept",
  description:
    "Spécialiste du print et marquage textile en Alsace. Sérigraphie, broderie, DTF, flocage pour entreprises et associations.",
  url: "https://maje-concept.fr",
  logo: "https://maje-concept.fr/logo.svg",
  image: "https://maje-concept.fr/og-image.jpg",
  telephone: "+33 3 89 XX XX XX",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10 Rue du Maréchal Foch",
    addressLocality: "Colmar",
    postalCode: "68000",
    addressRegion: "Alsace",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.0793,
    longitude: 7.3585,
  },
  areaServed: {
    "@type": "State",
    name: "Alsace",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de marquage textile",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Sérigraphie" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Broderie" },
      },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DTF" } },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Flocage" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Transfert" },
      },
    ],
  },
  sameAs: [
    "https://www.linkedin.com/company/maje-concept",
    "https://www.instagram.com/majececoncept",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={polly.variable}>
      <body className="bg-brand-black text-brand-cream font-display antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/*
          Provider order — NEVER change this sequence:
          1. LenisProvider — smooth scroll + single GSAP RAF loop
          2. CursorProvider — cursor variant string context
          3. AnimationProvider — preloader gate (isReady flag)

          CustomCursor: inside CursorProvider, outside AnimationProvider (global overlay)
          Navigation: inside AnimationProvider (may read isReady in future)
        */}
        <LenisProvider>
          <CursorProvider>
            <CustomCursor />
            <AnimationProvider>
              <Navigation />
              {children}
            </AnimationProvider>
          </CursorProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
