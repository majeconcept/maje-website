export interface ExpertiseDomain {
  id: string
  title: string
  description: string
  detail: string
  icon: "serigraphie" | "broderie" | "dtf" | "flocage" | "transfert"
}

export interface KpiStat {
  target: number
  suffix: string
  label: string
  description: string
}

export const EXPERTISE_DOMAINS: ExpertiseDomain[] = [
  {
    id: "serigraphie",
    title: "Sérigraphie",
    description: "Impression directe sur textile par pochoirs et encres spécialisées. Résultat net, couleurs vives, idéal pour les grandes séries.",
    detail: "Jusqu'à 8 couleurs simultanées — rendu premium sur tous supports",
    icon: "serigraphie",
  },
  {
    id: "broderie",
    title: "Broderie",
    description: "Logos et monogrammes brodés fil par fil avec machines industrielles. Rendu haut-de-gamme, durable, élégant.",
    detail: "Fils standard, métallisés ou lumineux — solidité garantie 200+ lavages",
    icon: "broderie",
  },
  {
    id: "dtf",
    title: "DTF & Sublimation",
    description: "Transfert numérique direct sur tissu — photo-réalisme, dégradés, petites séries économiques. Toutes couleurs possibles.",
    detail: "Résolution jusqu'à 1440 dpi — pour les projets exigeants",
    icon: "dtf",
  },
  {
    id: "flocage",
    title: "Flocage",
    description: "Floquage velours sur textile pour un toucher doux et un rendu distinctif. Idéal pour noms, numéros sportifs, logos.",
    detail: "Adhérence thermique permanente — résistant au lavage industriel",
    icon: "flocage",
  },
  {
    id: "transfert",
    title: "Transfert",
    description: "Impression sur film polymère puis thermocollage sur support textile. Polyvalent, précis, parfait pour les logos complexes.",
    detail: "Compatible tous textiles — même matières techniques et stretch",
    icon: "transfert",
  },
]

export const KPI_STATS: KpiStat[] = [
  {
    target: 7,
    suffix: " ans",
    label: "D'expérience",
    description: "Fondée en 2019, Maje Concept maîtrise toutes les techniques du marquage textile.",
  },
  {
    target: 2000,
    suffix: "+",
    label: "Clients actifs",
    description: "Entreprises, associations, institutions et collectivités qui nous font confiance.",
  },
  {
    target: 99,
    suffix: "%",
    label: "Satisfaction",
    description: "Taux de satisfaction mesuré sur nos 500 dernières commandes client.",
  },
  {
    target: 48,
    suffix: "h",
    label: "Délai moyen",
    description: "De la validation du bon de commande à la livraison pour les séries standard.",
  },
]
