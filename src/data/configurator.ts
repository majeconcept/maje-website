// src/data/configurator.ts

export type ProductType = 'tshirt' | 'polo' | 'sweat' | 'veste';
export type TechniqueType = 'serigraphie' | 'broderie' | 'dtf' | 'flocage' | 'transfert';
export type QuantityType = 10 | 25 | 50 | 100 | 250 | 500;
export type SizeRangeType = 'XS-XL' | 'XS-3XL';

export interface Product {
  id: ProductType;
  label: string;
  description: string;
}

export interface Color {
  id: string;
  label: string;
  hex: string;
  textClass: string; // pour le contraste du label
}

export interface Technique {
  id: TechniqueType;
  label: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  { id: 'tshirt', label: 'T-Shirt', description: 'Col rond, jersey 180g' },
  { id: 'polo', label: 'Polo', description: 'Piqué coton, col boutonné' },
  { id: 'sweat', label: 'Sweat / Hoodie', description: 'Molleton 300g, capuche' },
  { id: 'veste', label: 'Veste Softshell', description: '2 couches, coupe-vent' },
];

export const COLORS: Color[] = [
  { id: 'noir', label: 'Noir profond', hex: '#0A0A0F', textClass: 'text-white' },
  { id: 'blanc', label: 'Blanc cassé', hex: '#F5F5F0', textClass: 'text-gray-900' },
  { id: 'gris', label: 'Gris chiné', hex: '#8A8A8A', textClass: 'text-white' },
  { id: 'marine', label: 'Marine', hex: '#1A2744', textClass: 'text-white' },
  { id: 'rouge', label: 'Rouge vif', hex: '#C0392B', textClass: 'text-white' },
  { id: 'vert', label: 'Vert bouteille', hex: '#1B4332', textClass: 'text-white' },
  { id: 'bordeaux', label: 'Bordeaux', hex: '#6B0F1A', textClass: 'text-white' },
  { id: 'beige', label: 'Beige sable', hex: '#D4B896', textClass: 'text-gray-900' },
];

export const TECHNIQUES: Technique[] = [
  { id: 'serigraphie', label: 'Sérigraphie', description: 'Idéal grandes séries, couleurs vives' },
  { id: 'broderie', label: 'Broderie', description: 'Relief et durabilité, aspect premium' },
  { id: 'dtf', label: 'DTF', description: 'Impression directe, détails fins' },
  { id: 'flocage', label: 'Flocage', description: 'Velours mat, look sportswear' },
  { id: 'transfert', label: 'Transfert', description: 'Petites séries, haute précision' },
];

export const QUANTITIES: QuantityType[] = [10, 25, 50, 100, 250, 500];

// Prix unitaire (€/pièce) par produit × technique × quantité
export const PRICE_TABLE: Record<ProductType, Record<TechniqueType, Record<QuantityType, number>>> = {
  tshirt: {
    serigraphie: { 10: 18, 25: 14, 50: 11, 100: 9, 250: 7.5, 500: 6.5 },
    broderie:    { 10: 22, 25: 18, 50: 15, 100: 13, 250: 11, 500: 10 },
    dtf:         { 10: 16, 25: 13, 50: 10, 100: 8.5, 250: 7, 500: 6 },
    flocage:     { 10: 15, 25: 12, 50: 9.5, 100: 8, 250: 6.5, 500: 5.5 },
    transfert:   { 10: 17, 25: 13.5, 50: 10.5, 100: 9, 250: 7.5, 500: 6.5 },
  },
  polo: {
    serigraphie: { 10: 22, 25: 17, 50: 13.5, 100: 11, 250: 9, 500: 7.5 },
    broderie:    { 10: 28, 25: 22, 50: 18, 100: 16, 250: 13, 500: 12 },
    dtf:         { 10: 20, 25: 16, 50: 12, 100: 10.5, 250: 8.5, 500: 7.5 },
    flocage:     { 10: 19, 25: 15, 50: 11.5, 100: 9.5, 250: 7.5, 500: 6.5 },
    transfert:   { 10: 21, 25: 16.5, 50: 13, 100: 11, 250: 9, 500: 7.5 },
  },
  sweat: {
    serigraphie: { 10: 28, 25: 22, 50: 17, 100: 14, 250: 11.5, 500: 9.5 },
    broderie:    { 10: 35, 25: 28, 50: 23, 100: 20, 250: 17, 500: 15 },
    dtf:         { 10: 26, 25: 21, 50: 16, 100: 13, 250: 10.5, 500: 9 },
    flocage:     { 10: 24, 25: 19, 50: 15, 100: 12.5, 250: 10, 500: 8.5 },
    transfert:   { 10: 27, 25: 21.5, 50: 16.5, 100: 13.5, 250: 11, 500: 9.5 },
  },
  veste: {
    serigraphie: { 10: 38, 25: 30, 50: 24, 100: 20, 250: 16, 500: 13.5 },
    broderie:    { 10: 48, 25: 39, 50: 32, 100: 28, 250: 24, 500: 21 },
    dtf:         { 10: 35, 25: 28, 50: 22, 100: 18.5, 250: 15, 500: 12.5 },
    flocage:     { 10: 33, 25: 26, 50: 20.5, 100: 17, 250: 13.5, 500: 11.5 },
    transfert:   { 10: 37, 25: 29.5, 50: 23, 100: 19, 250: 15.5, 500: 13 },
  },
};

export function estimatePrice(
  productType: ProductType,
  technique: TechniqueType,
  quantity: QuantityType
): number {
  return PRICE_TABLE[productType][technique][quantity];
}
