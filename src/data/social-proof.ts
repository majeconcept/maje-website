export interface ClientLogo {
  id: string
  name: string
  sector: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  sector: string
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: "l01", name: "Alsace Habitat", sector: "Immobilier social" },
  { id: "l02", name: "CTS Strasbourg", sector: "Transport public" },
  { id: "l03", name: "Région Grand Est", sector: "Collectivité" },
  { id: "l04", name: "Eiffage Construction", sector: "BTP" },
  { id: "l05", name: "Brasserie Meteor", sector: "Agro-alimentaire" },
  { id: "l06", name: "Rugby Club Colmar", sector: "Sport" },
  { id: "l07", name: "Krys Group Alsace", sector: "Retail optique" },
  { id: "l08", name: "Hôtel Le Bouclier d'Or", sector: "Hôtellerie" },
  { id: "l09", name: "Chambre de Commerce Alsace", sector: "Institutionnel" },
  { id: "l10", name: "Université de Strasbourg", sector: "Enseignement supérieur" },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t01",
    quote:
      "Nous travaillons avec Maje Concept depuis 4 ans pour l'ensemble de nos uniformes terrain. Les délais sont toujours tenus — même pour nos commandes d'urgence à 72h — et la qualité de broderie est irréprochable. Un partenaire de confiance pour notre image de marque.",
    author: "Sophie Wendling",
    role: "Directrice RH & Communication",
    company: "Alsace Habitat",
    sector: "Bailleur social — 15 000 logements gérés",
  },
  {
    id: "t02",
    quote:
      "Pour la Foire de Strasbourg 2024, nous avons commandé 2 500 t-shirts en urgence. Maje Concept a livré en 5 jours ouvrés, qualité sérigraphie impeccable sur tous les coloris. Je recommande sans réserve à quiconque cherche un prestataire print alsacien sérieux.",
    author: "Marc Hurst",
    role: "Responsable Événementiel",
    company: "CTS Strasbourg",
    sector: "Régie de transport public",
  },
  {
    id: "t03",
    quote:
      "Notre collection capsule 150 ans de la Brasserie Meteor nécessitait une sérigraphie 5 couleurs sur coton bio — une réalisation délicate. Maje Concept a parfaitement maîtrisé les tons et le rendu. Les 500 pièces de l'édition collector se sont vendues en 3 semaines.",
    author: "Éric Haeffele",
    role: "Directeur Marketing",
    company: "Brasserie Meteor",
    sector: "Brasserie alsacienne — fondée 1640",
  },
]
