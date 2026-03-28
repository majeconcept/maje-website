// src/lib/configuratorContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type ProductType,
  type TechniqueType,
  type QuantityType,
  type SizeRangeType,
  estimatePrice,
} from "@/data/configurator";

export interface ConfiguratorState {
  productType: ProductType;
  colorId: string;
  colorName: string;
  colorHex: string;
  technique: TechniqueType;
  quantity: QuantityType;
  sizeRange: SizeRangeType;
  estimatedPrice: number;
  hasConfig: boolean; // true once user interacts
}

interface ConfiguratorContextValue {
  config: ConfiguratorState;
  updateConfig: (updates: Partial<Omit<ConfiguratorState, 'estimatedPrice'>>) => void;
  resetConfig: () => void;
  getConfigSummary: () => string;
}

const DEFAULT_STATE: ConfiguratorState = {
  productType: 'tshirt',
  colorId: 'noir',
  colorName: 'Noir profond',
  colorHex: '#0A0A0F',
  technique: 'serigraphie',
  quantity: 50,
  sizeRange: 'XS-XL',
  estimatedPrice: 11, // tshirt × serigraphie × 50
  hasConfig: false,
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfiguratorState>(DEFAULT_STATE);

  const updateConfig = useCallback((updates: Partial<Omit<ConfiguratorState, 'estimatedPrice'>>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates, hasConfig: true };
      // Recalculate price whenever any relevant field changes
      next.estimatedPrice = estimatePrice(
        next.productType,
        next.technique,
        next.quantity
      );
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_STATE);
  }, []);

  const getConfigSummary = useCallback((): string => {
    if (!config.hasConfig) return "";
    const productLabels: Record<ProductType, string> = {
      tshirt: 'T-Shirt', polo: 'Polo', sweat: 'Sweat / Hoodie', veste: 'Veste Softshell'
    };
    const techniqueLabels: Record<TechniqueType, string> = {
      serigraphie: 'Sérigraphie', broderie: 'Broderie',
      dtf: 'DTF', flocage: 'Flocage', transfert: 'Transfert'
    };
    return `${productLabels[config.productType]} ${config.colorName} × ${config.quantity} pièces — ${techniqueLabels[config.technique]} — Tailles ${config.sizeRange} — À partir de ${config.estimatedPrice}€/pièce`;
  }, [config]);

  return (
    <ConfiguratorContext.Provider value={{ config, updateConfig, resetConfig, getConfigSummary }}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator(): ConfiguratorContextValue {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error("useConfigurator must be used inside ConfiguratorProvider");
  return ctx;
}
