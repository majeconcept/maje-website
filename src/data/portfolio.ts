export type PortfolioCategory = "Sérigraphie" | "Broderie" | "DTF" | "Flocage" | "Transfert"

export interface PortfolioProject {
  id: string
  title: string
  client: string
  category: PortfolioCategory
  description: string
  tags: string[]
  color: string        // CSS gradient for placeholder
  colSpan: string      // Tailwind class e.g. "col-span-7"
  rowSpan: string      // Tailwind class e.g. "row-span-2"
}

export const PORTFOLIO_CATEGORIES = ["Tous", "Sérigraphie", "Broderie", "DTF", "Flocage", "Transfert"] as const
export type PortfolioFilter = typeof PORTFOLIO_CATEGORIES[number]

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "p01",
    title: "Collection Workwear Alsace Habitat",
    client: "Alsace Habitat",
    category: "Broderie",
    description: "1 200 polaires techniques avec broderie logo multi-couleur sur poitrine et épaule. Rendu premium, parfait pour les équipes terrain.",
    tags: ["Polaire", "Logo brodé", "1 200 pièces"],
    color: "linear-gradient(135deg, oklch(0.22 0.018 240) 0%, oklch(0.15 0.012 260) 100%)",
    colSpan: "col-span-7",
    rowSpan: "row-span-2",
  },
  {
    id: "p02",
    title: "T-shirts événement Foire de Strasbourg",
    client: "CTS Strasbourg",
    category: "Sérigraphie",
    description: "2 500 t-shirts 4 coloris, sérigraphie 3 couleurs recto-verso. Délai 5 jours — livré à temps pour l'ouverture.",
    tags: ["T-shirt", "Sérigraphie", "2 500 pièces"],
    color: "linear-gradient(135deg, oklch(0.72 0.14 82) 0%, oklch(0.55 0.10 70) 100%)",
    colSpan: "col-span-5",
    rowSpan: "row-span-1",
  },
  {
    id: "p03",
    title: "Uniformes Rugby Club Colmar",
    client: "Rugby Club Colmar",
    category: "DTF",
    description: "350 maillots sublimation complète avec numéros dos et noms joueurs en DTF. Couleurs club 100% fidèles.",
    tags: ["Maillot", "DTF", "Numéros personnalisés"],
    color: "linear-gradient(135deg, oklch(0.35 0.06 145) 0%, oklch(0.22 0.04 160) 100%)",
    colSpan: "col-span-5",
    rowSpan: "row-span-1",
  },
  {
    id: "p04",
    title: "Collection capsule Hôtel Le Bouclier d'Or",
    client: "Hôtel Le Bouclier d'Or",
    category: "Broderie",
    description: "Peignoirs, serviettes et chemises de sommelier avec broderie dorée fil métallisé. Positionnement 4 étoiles exigé.",
    tags: ["Hôtellerie", "Fil métallisé", "Série limitée"],
    color: "linear-gradient(135deg, oklch(0.30 0.05 50) 0%, oklch(0.18 0.03 60) 100%)",
    colSpan: "col-span-7",
    rowSpan: "row-span-2",
  },
  {
    id: "p05",
    title: "Vestes softshell BTP Eiffage Est",
    client: "Eiffage Construction Est",
    category: "Flocage",
    description: "800 vestes haute-visibilité avec flocage réfléchissant logos Eiffage + sécurité. Norme EN 20471 respectée.",
    tags: ["Haute-visibilité", "Flocage", "800 pièces"],
    color: "linear-gradient(135deg, oklch(0.45 0.12 55) 0%, oklch(0.28 0.08 45) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p06",
    title: "Merchandising Krys Group Alsace",
    client: "Krys Group Alsace",
    category: "Sérigraphie",
    description: "Série promotionnelle 3 000 tote-bags sérigraphiés + 1 500 t-shirts pour réseau de 12 magasins alsaciens.",
    tags: ["Tote-bag", "Réseau", "3 000 pièces"],
    color: "linear-gradient(135deg, oklch(0.28 0.04 250) 0%, oklch(0.15 0.02 260) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p07",
    title: "Kit accueil Région Grand Est",
    client: "Région Grand Est",
    category: "Transfert",
    description: "10 000 kits d'accueil agents régionaux : polo + carnet + stylo gravé. Identité visuelle institutionnelle stricte.",
    tags: ["Institutionnel", "Transfert", "10 000 kits"],
    color: "linear-gradient(135deg, oklch(0.32 0.06 195) 0%, oklch(0.18 0.04 210) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "p08",
    title: "Capsule limitée Brasserie Meteor",
    client: "Brasserie Meteor",
    category: "Sérigraphie",
    description: "Collection 150 ans — 500 t-shirts premium coton bio, sérigraphie 5 couleurs simulation trichromie. Édition collector.",
    tags: ["Édition limitée", "Bio", "5 couleurs"],
    color: "linear-gradient(135deg, oklch(0.55 0.08 30) 0%, oklch(0.35 0.06 20) 100%)",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
]
