import { CropDefinition, CropType, Plot } from '../types/game';

export const INITIAL_CROPS: Record<CropType, CropDefinition> = {
  hortalicas: {
    id: 'hortalicas',
    name: 'Hortaliças Orgânicas',
    icon: '🥬',
    seedCost: 30, // R$ 30 por canteiro
    growthDays: 2, // Ciclo rápido para iniciantes
    waterRequirement: 80,
    nutrientRequirement: 60,
    baseYield: 15, // 15 caixas
    unitName: 'caixas',
    basePrice: 8, // R$ 8 por caixa = ~R$ 120 receita bruta
    currentPrice: 8.5,
    priceVolatility: 0.15,
    minLevel: 1,
    description: 'Ciclo rápido e fluxo de caixa constante. Ideal para formar a primeira reserva de capital da fazenda.',
    seedsPerCycle: 2, // Requer 2 caixas da colheita convertidas em mudas/sementes para replantar
    pestResistance: 40,
  },
  milho: {
    id: 'milho',
    name: 'Milho Híbrido',
    icon: '🌽',
    seedCost: 60,
    growthDays: 3,
    waterRequirement: 70,
    nutrientRequirement: 70,
    baseYield: 18,
    unitName: 'sacas',
    basePrice: 12, // R$ 12 por saca = ~R$ 216 receita bruta
    currentPrice: 12.0,
    priceVolatility: 0.20,
    minLevel: 1,
    description: 'Grão versátil com grande demanda na ração animal e na indústria alimentícia brasileira.',
    seedsPerCycle: 3, // Precisa reservar 3 sacas para cobrir as sementes do próximo plantio
    pestResistance: 55,
  },
  feijao: {
    id: 'feijao',
    name: 'Feijão Carioca',
    icon: '🫘',
    seedCost: 80,
    growthDays: 4,
    waterRequirement: 65,
    nutrientRequirement: 65,
    baseYield: 16,
    unitName: 'sacas',
    basePrice: 18, // R$ 18 por saca = ~R$ 288 receita bruta
    currentPrice: 18.2,
    priceVolatility: 0.25,
    minLevel: 2,
    description: 'Alimento básico da mesa brasileira. Preço muito sensível ao clima nas regiões produtoras.',
    seedsPerCycle: 3,
    pestResistance: 60,
  },
  soja: {
    id: 'soja',
    name: 'Soja Grão Exportação',
    icon: '🌱',
    seedCost: 120,
    growthDays: 5,
    waterRequirement: 75,
    nutrientRequirement: 80,
    baseYield: 24,
    unitName: 'sacas',
    basePrice: 22, // R$ 22 por saca = ~R$ 528 receita bruta
    currentPrice: 22.5,
    priceVolatility: 0.22,
    minLevel: 3,
    description: 'Carro-chefe do agronegócio e das exportações brasileiras. Cotação ligada à Bolsa de Chicago e ao câmbio.',
    seedsPerCycle: 4,
    pestResistance: 70,
  },
  trigo: {
    id: 'trigo',
    name: 'Trigo de Inverno',
    icon: '🌾',
    seedCost: 100,
    growthDays: 4,
    waterRequirement: 60,
    nutrientRequirement: 70,
    baseYield: 20,
    unitName: 'sacas',
    basePrice: 16,
    currentPrice: 16.0,
    priceVolatility: 0.18,
    minLevel: 4,
    description: 'Cultura excelente para rotação de culturas no outono/inverno no Sul e Centro-Oeste.',
    seedsPerCycle: 3,
    pestResistance: 65,
  },
  cafe: {
    id: 'cafe',
    name: 'Café Arábica Especial',
    icon: '☕',
    seedCost: 200,
    growthDays: 6,
    waterRequirement: 85,
    nutrientRequirement: 85,
    baseYield: 28,
    unitName: 'sacas',
    basePrice: 35, // R$ 35 por saca = ~R$ 980 receita bruta
    currentPrice: 36.0,
    priceVolatility: 0.30,
    minLevel: 5,
    description: 'Commodity nobre de alto valor agregado. Exige alto investimento inicial e manejo meticuloso.',
    seedsPerCycle: 5,
    pestResistance: 50,
  },
};

/**
 * Calcula a colheita real de um lote considerando hidratação, adubação e pragas
 */
export function calculatePlotHarvestYield(
  plot: Plot,
  cropDef: CropDefinition
): {
  yieldAmount: number;
  qualityRating: 'excelente' | 'boa' | 'regular' | 'prejudicada';
  lossReason?: string;
} {
  let multiplier = 1.0;
  let lossReason: string | undefined;

  // Penalidade de água se muito seco
  if (plot.waterLevel < 40) {
    multiplier *= 0.65;
    lossReason = 'Déficit hídrico (solo ressecado)';
  } else if (plot.waterLevel >= 75) {
    multiplier *= 1.15; // Bônus de boa irrigação
  }

  // Penalidade de adubo
  if (plot.nutrientLevel < 40) {
    multiplier *= 0.75;
    lossReason = lossReason ? `${lossReason} e solo empobrecido` : 'Solo com baixa fertilidade';
  } else if (plot.nutrientLevel >= 80) {
    multiplier *= 1.10;
  }

  // Penalidade severa se infestação de pragas não foi tratada
  if (plot.pestInfestation) {
    multiplier *= 0.50;
    lossReason = lossReason ? `${lossReason} com ataque de pragas não combatido` : 'Danos causados por pragas na lavoura';
  }

  const finalYield = Math.max(1, Math.round(cropDef.baseYield * multiplier));

  let qualityRating: 'excelente' | 'boa' | 'regular' | 'prejudicada' = 'boa';
  if (multiplier >= 1.2) qualityRating = 'excelente';
  else if (multiplier < 0.7) qualityRating = 'prejudicada';
  else if (multiplier < 0.9) qualityRating = 'regular';

  return {
    yieldAmount: finalYield,
    qualityRating,
    lossReason,
  };
}

/**
 * Atualiza o estado diário dos canteiros na virada de dia
 */
export function advancePlotsDay(
  plots: Plot[],
  crops: Record<CropType, CropDefinition>,
  weatherRain: boolean
): {
  updatedPlots: Plot[];
  newMaturePlots: number;
  newPestInfestations: number;
  dailyMaintenanceCost: number;
} {
  let newMaturePlots = 0;
  let newPestInfestations = 0;
  let dailyMaintenanceCost = 0;

  const updatedPlots = plots.map((plot) => {
    if (!plot.crop) {
      // Canteiro vazio apenas perde um pouco de umidade/nutrientes
      return {
        ...plot,
        waterLevel: weatherRain ? 100 : Math.max(10, plot.waterLevel - 15),
        nutrientLevel: Math.max(20, plot.nutrientLevel - 2),
        pestInfestation: false,
      };
    }

    const cropDef = crops[plot.crop];
    dailyMaintenanceCost += 5; // Custo de manutenção básico por canteiro cultivado (combustível/água/ferramentas)

    // Efeito da chuva ou perda natural de umidade
    let newWater = weatherRain ? 100 : Math.max(0, plot.waterLevel - 30);
    let newNutrients = Math.max(0, plot.nutrientLevel - 15);
    let daysPlanted = plot.daysPlanted + 1;
    let stage = plot.stage;
    let pestInfestation = plot.pestInfestation;

    // Risco de pragas se não estiver chovendo torrencialmente
    if (!pestInfestation && Math.random() * 100 > cropDef.pestResistance) {
      pestInfestation = true;
      newPestInfestations++;
    }

    // Avanço de estágios
    if (stage === 'plantado') {
      stage = 'crescendo';
    } else if (stage === 'crescendo') {
      if (daysPlanted >= cropDef.growthDays) {
        stage = 'maduro';
        newMaturePlots++;
      }
    }

    return {
      ...plot,
      daysPlanted,
      waterLevel: newWater,
      nutrientLevel: newNutrients,
      stage,
      pestInfestation,
    };
  });

  return {
    updatedPlots,
    newMaturePlots,
    newPestInfestations,
    dailyMaintenanceCost,
  };
}

/**
 * Flutuação diária dos preços agrícolas com base em oferta, demanda e eventos
 */
export function simulateCropMarketDailyPrices(
  crops: Record<CropType, CropDefinition>,
  priceMultipliers: Map<CropType, number>
): Record<CropType, CropDefinition> {
  const updated: Record<CropType, CropDefinition> = { ...crops };

  (Object.keys(crops) as CropType[]).forEach((cropKey) => {
    const crop = crops[cropKey];
    const eventFactor = priceMultipliers.get(cropKey) ?? 1.0;
    // Ruído diário de mercado de commodities (-10% a +10%)
    const randomVariation = (Math.random() - 0.48) * crop.priceVolatility;
    let newPrice = crop.currentPrice * (1 + randomVariation) * eventFactor;

    // Limites de preço para manter a economia balanceada
    const minPrice = crop.basePrice * 0.6;
    const maxPrice = crop.basePrice * 2.2;
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

    updated[cropKey] = {
      ...crop,
      currentPrice: Number(newPrice.toFixed(2)),
    };
  });

  return updated;
}
