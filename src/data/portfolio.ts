export type PortfolioCategory = "Sérigraphie" | "Broderie" | "DTF" | "Flocage" | "Transfert"

export interface PortfolioProject {
  id: string
  title: string
  client: string
  category: PortfolioCategory
  description: string
  tags: string[]
  image: string          // Path to WebP image in /public
  color: string          // CSS gradient fallback
  colSpan: string        // Tailwind class e.g. "col-span-7"
  rowSpan: string        // Tailwind class e.g. "row-span-2"
}

export const PORTFOLIO_CATEGORIES = ["Tous", "Sérigraphie", "Broderie", "DTF", "Flocage", "Transfert"] as const
export type PortfolioFilter = typeof PORTFOLIO_CATEGORIES[number]

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "p01",
    title: "Bâche grand format CrossFit 67",
    client: "CrossFit 67",
    category: "Sérigraphie",
    description: "Bâche murale grand format avec artwork coq japonisant détaillé. Impression haute résolution, couleurs vibrantes sur fond noir.",
    tags: ["Bâche", "Grand format", "Artwork custom"],
    image: "/images/portfolio/cf67-bache-coq.webp",
    color: "linear-gradient(135deg, oklch(0.15 0.01 250) 0%, oklch(0.10 0.008 260) 100%)",
    colSpan: "col-span-7",
    rowSpan: "row-span-2",
  },
  {
    id: "p02",
    title: "Chaises longues Festival Jazz Manouche",
    client: "Festival Jazz Manouche Spechbach",
    category: "Transfert",
    description: "Série de transats personnalisés avec sérigraphie illustration musicien jazz. Rendu élégant noir & blanc pour événement culturel.",
    tags: ["Transat", "Événementiel", "Illustration"],
    image: "/images/portfolio/festival-jazz-chaises.webp",
    color: "linear-gradient(135deg, oklch(0.22 0.018 240) 0%, oklch(0.15 0.012 260) 100%)",
    colSpan: "col-span-5",
    rowSpan: "row-span-1",
  },
  {
    id: "p03",
    title: "Covering véhicule Alsace Fluid Technic",
    client: "Alsace Fluid Technic",
    category: "Transfert",
    description: "Total covering d'un utilitaire aux couleurs de l'entreprise. Design graphique vert vif avec typographie impactante, visible à 100 mètres.",
    tags: ["Covering", "Véhicule", "Identité visuelle"],
    image: "/images/portfolio/alsace-fluid-van.webp",
    color: "linear-gradient(135deg, oklch(0.55 0.15 140) 0%, oklch(0.35 0.10 150) 100%)",
    colSpan: "col-span-5",
    rowSpan: "row-span-1",
  },
  {
    id: "p04",
    title: "Sweats brodés Hugo Rénovation & Paysage",
    client: "Hugo Rénovation & Paysage",
    category: "Broderie",
    description: "Sweats crème haut-de-gamme avec broderie logo multicolore sur poitrine. Finition soignée, rendu élégant pour artisan paysagiste.",
    tags: ["Sweat", "Broderie logo", "Premium"],
    image: "/images/portfolio/hugo-renovation-sweat.webp",
    color: "linear-gradient(135deg, oklch(0.85 0.04 85) 0%, oklch(0.70 0.03 80) 100%)",
    colSpan: "col-span-7",
    rowSpan: "row-span-2",
  },
  {
    id: "p05",
    title: "Doudoune floquée Brasserie Cabrio",
    client: "Brasserie Cabrio",
    category: "Flocage",
    description: "Doudoune rouge avec flocage blanc logo Cabrio Brasserie Artisanale. Marquage résistant, rendu net sur textile technique.",
    tags: ["Doudoune", "Flocage", "Workwear"],
    image: "/images/portfolio/cabrio-doudoune-rouge.webp",
    color: "linear-gradient(135deg, oklch(0.50 0.18 25) 0%, oklch(0.30 0.12 20) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p06",
    title: "Sacs personnalisés ASAD",
    client: "ASAD — Aide et Soins à Domicile",
    category: "Sérigraphie",
    description: "Sacs jute et coton sérigraphiés logo ASAD pour campagne de communication. Marquage propre, support éco-responsable.",
    tags: ["Sac", "Sérigraphie", "Éco-responsable"],
    image: "/images/portfolio/asad-sac.webp",
    color: "linear-gradient(135deg, oklch(0.80 0.04 85) 0%, oklch(0.65 0.03 80) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p07",
    title: "Enseigne Exclusive Detailing Car",
    client: "Exclusive Detailing Car",
    category: "Sérigraphie",
    description: "Enseigne façade complète avec panneau dibond, lettrage découpé et habillage vitrine. Identité premium pour centre detailing automobile.",
    tags: ["Enseigne", "Façade", "Signalétique"],
    image: "/images/portfolio/exclusive-detailing-enseigne.webp",
    color: "linear-gradient(135deg, oklch(0.20 0.02 250) 0%, oklch(0.12 0.01 260) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p08",
    title: "T-shirts CrossFit 67 Back to Basics",
    client: "CrossFit 67",
    category: "Sérigraphie",
    description: "T-shirts événementiels avec sérigraphie multi-couleurs artwork coq et fleurs. Rendu détaillé sur coton noir premium.",
    tags: ["T-shirt", "Sérigraphie", "Événementiel"],
    image: "/images/portfolio/cf67-tshirt-basics.webp",
    color: "linear-gradient(135deg, oklch(0.18 0.01 250) 0%, oklch(0.10 0.008 260) 100%)",
    colSpan: "col-span-6",
    rowSpan: "row-span-1",
  },
  {
    id: "p09",
    title: "Panneau Brasserie Cabrio",
    client: "Brasserie Cabrio",
    category: "Sérigraphie",
    description: "Panneau terrasse grand format, typographie bold jaune sur fond noir. Impact visuel maximum pour attirer la clientèle.",
    tags: ["Panneau", "Print", "Brasserie"],
    image: "/images/portfolio/cabrio-panneau-terrasse.webp",
    color: "linear-gradient(135deg, oklch(0.15 0.01 80) 0%, oklch(0.10 0.008 70) 100%)",
    colSpan: "col-span-6",
    rowSpan: "row-span-1",
  },
  {
    id: "p10",
    title: "T-shirt DTF Mjolnir Training",
    client: "Mjolnir Training",
    category: "DTF",
    description: "T-shirts noirs avec impression DTF full color — marteau et fleurs tropicales. Dégradés et détails fins parfaitement restitués.",
    tags: ["T-shirt", "DTF", "Full color"],
    image: "/images/portfolio/mjolnir-tshirt-fleurs.webp",
    color: "linear-gradient(135deg, oklch(0.20 0.03 350) 0%, oklch(0.12 0.02 340) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p11",
    title: "Transat Cabrio — Mockup collection",
    client: "Brasserie Cabrio",
    category: "Transfert",
    description: "Collection de transats sublimés aux designs de chaque bière artisanale Cabrio. Impression full-color, résistant UV et intempéries.",
    tags: ["Transat", "Sublimation", "Collection"],
    image: "/images/portfolio/cabrio-transat-mockup.webp",
    color: "linear-gradient(135deg, oklch(0.45 0.12 145) 0%, oklch(0.30 0.08 150) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p12",
    title: "Broderie polaire ASAD",
    client: "ASAD — Aide et Soins à Domicile",
    category: "Broderie",
    description: "Polaires grises avec broderie logo ASAD sur poitrine. Fil turquoise, rendu net et professionnel pour équipes soignantes.",
    tags: ["Polaire", "Broderie", "Institutionnel"],
    image: "/images/portfolio/asad-broderie-polaire.webp",
    color: "linear-gradient(135deg, oklch(0.60 0.02 250) 0%, oklch(0.40 0.01 260) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
]
