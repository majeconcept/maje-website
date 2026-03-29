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
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://majeconcept.com"
  ),

  title: {
    default: "Maje Concept — Impression & Marquage Textile Premium en Alsace | Sérigraphie, Broderie, DTF",
    template: "%s | Maje Concept",
  },
  description:
    "Maje Concept, spécialiste du marquage textile en Alsace depuis 2019. Sérigraphie, broderie, DTF, flocage, transfert et covering véhicule à Colmar. Devis gratuit sous 24h pour entreprises, associations et collectivités.",

  keywords: [
    "marquage textile Alsace",
    "impression textile Colmar",
    "sérigraphie Alsace",
    "broderie personnalisée Colmar",
    "DTF impression textile",
    "flocage textile professionnel",
    "transfert textile Alsace",
    "vêtements professionnels personnalisés",
    "print textile Alsace",
    "tee-shirt personnalisé Colmar",
    "covering véhicule Alsace",
    "signalétique entreprise Alsace",
    "enseigne personnalisée Colmar",
    "tote bag personnalisé",
    "workwear marqué Alsace",
    "impression numérique textile",
    "sublimation textile Alsace",
    "objet publicitaire Colmar",
    "marquage textile Haut-Rhin",
    "sérigraphie Bas-Rhin",
  ],

  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Maje Concept",
    title: "Maje Concept — Impression & Marquage Textile Premium en Alsace",
    description:
      "Sérigraphie, broderie, DTF, flocage et covering véhicule à Colmar. Devis gratuit sous 24h — plus de 2000 clients satisfaits depuis 2019.",
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
    title: "Maje Concept — Marquage Textile Premium en Alsace",
    description:
      "Sérigraphie, broderie, DTF, flocage à Colmar. +2000 clients. Devis gratuit sous 24h.",
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
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  other: {
    "geo.region": "FR-68",
    "geo.placename": "Colmar",
    "geo.position": "48.0793;7.3585",
    "ICBM": "48.0793, 7.3585",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://majeconcept.com/#business",
  name: "Maje Concept",
  alternateName: "Maje Concept — Impression & Marquage Textile",
  description:
    "Spécialiste du print et marquage textile en Alsace depuis 2019. Sérigraphie, broderie, DTF, flocage, transfert et covering véhicule pour entreprises, associations et collectivités.",
  url: "https://majeconcept.com",
  logo: {
    "@type": "ImageObject",
    url: "https://majeconcept.com/logo.svg",
    width: 200,
    height: 60,
  },
  image: [
    "https://majeconcept.com/og-image.jpg",
    "https://majeconcept.com/images/portfolio/cf67-bache-coq.webp",
    "https://majeconcept.com/images/portfolio/hugo-renovation-sweat.webp",
  ],
  telephone: "+33 3 89 XX XX XX",
  email: "contact@maje-concept.fr",
  foundingDate: "2019",
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Virement, Chèque, Espèces",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10 Rue du Maréchal Foch",
    addressLocality: "Colmar",
    postalCode: "68000",
    addressRegion: "Grand Est",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.0793,
    longitude: 7.3585,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  areaServed: [
    { "@type": "State", name: "Alsace" },
    { "@type": "AdministrativeArea", name: "Haut-Rhin" },
    { "@type": "AdministrativeArea", name: "Bas-Rhin" },
    { "@type": "AdministrativeArea", name: "Grand Est" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de marquage textile et impression",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sérigraphie",
          description: "Impression directe sur textile par pochoirs et encres spécialisées, jusqu'à 8 couleurs simultanées.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Broderie",
          description: "Logos et monogrammes brodés fil par fil avec machines industrielles. Rendu haut-de-gamme.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "DTF & Sublimation",
          description: "Transfert numérique direct sur tissu — photo-réalisme, dégradés, petites séries économiques.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Flocage",
          description: "Floquage velours sur textile pour un toucher doux et un rendu distinctif.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Transfert & Covering",
          description: "Impression sur film polymère, thermocollage textile et covering véhicule grand format.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Signalétique & Enseignes",
          description: "Panneaux, enseignes, bâches et signalétique professionnelle sur mesure.",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "127",
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
