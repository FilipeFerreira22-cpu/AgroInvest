import { InvestmentProduct, UserPosition, MacroIndicators } from '../types/game';

// Tabela de IOF Regressivo para resgates até 29 dias (sobre o rendimento)
export const IOF_REGRESSIVE_RATES: number[] = [
  0.96, 0.93, 0.90, 0.86, 0.83, 0.80, 0.76, 0.73, 0.70, 0.66,
  0.63, 0.60, 0.56, 0.53, 0.50, 0.46, 0.43, 0.40, 0.36, 0.33,
  0.30, 0.26, 0.23, 0.20, 0.16, 0.13, 0.10, 0.06, 0.03, 0.00
];

/**
 * Retorna a alíquota de IOF para a quantidade de dias da aplicação.
 */
export function getIOFRate(daysHeld: number): number {
  if (daysHeld <= 0) return 0.96;
  if (daysHeld >= 30) return 0.0;
  return IOF_REGRESSIVE_RATES[daysHeld - 1] ?? 0.0;
}

/**
 * Tabela Regressiva de Imposto de Renda (IR) para Renda Fixa no Brasil.
 * Até 180 dias: 22,5%
 * 181 a 360 dias: 20,0%
 * 361 a 720 dias: 17,5%
 * Acima de 720 dias: 15,0%
 */
export function getFixedIncomeIRRate(daysHeld: number): number {
  if (daysHeld <= 180) return 0.225;
  if (daysHeld <= 360) return 0.20;
  if (daysHeld <= 720) return 0.175;
  return 0.15;
}

/**
 * Converte taxa anual em taxa diária efetiva (convenção brasileira: juros compostos com 252 dias úteis simulados)
 */
export function annualToDailyRate(annualRate: number, workingDaysPerYear = 252): number {
  if (annualRate <= -1) return 0;
  return Math.pow(1 + annualRate, 1 / workingDaysPerYear) - 1;
}

/**
 * Calcula o valor líquido de resgate de uma posição, detalhando Rendimento Bruto, IOF e IR retido.
 */
export interface LiquidationBreakdown {
  grossValue: number;
  grossProfit: number;
  iofAmount: number;
  irAmount: number;
  totalTax: number;
  netValue: number;
  netProfit: number;
  effectiveTaxRate: number;
  explanation: string;
}

export function calculateLiquidationBreakdown(
  position: UserPosition,
  product: InvestmentProduct,
  currentDay: number
): LiquidationBreakdown {
  const daysHeld = Math.max(1, currentDay - position.purchaseDay);
  const grossValue = position.currentValue;
  const grossProfit = Math.max(0, grossValue - position.amountInvested);

  let iofAmount = 0;
  let irAmount = 0;

  if (product.category === 'renda_fixa' || product.category === 'tesouro') {
    if (product.hasIOF && daysHeld < 30) {
      const iofRate = getIOFRate(daysHeld);
      iofAmount = grossProfit * iofRate;
    }

    const profitAfterIOF = Math.max(0, grossProfit - iofAmount);

    if (!product.isTaxExempt) {
      const irRate = getFixedIncomeIRRate(daysHeld);
      irAmount = profitAfterIOF * irRate;
    }
  } else if (product.category === 'acoes') {
    // Para ações, vendas até R$ 20.000 no mês são isentas de IR para swing trade pessoa física
    // Se o valor de venda for superior, alíquota de 15% sobre o ganho de capital
    if (grossValue > 20000 && grossProfit > 0) {
      irAmount = grossProfit * 0.15;
    }
  } else if (product.category === 'fiis') {
    // Venda de cotas de FII com lucro paga 20% de IR sobre o ganho de capital (não há isenção de R$ 20k para cotas)
    if (grossProfit > 0) {
      irAmount = grossProfit * 0.20;
    }
  } else if (product.category === 'cripto') {
    // Criptoativos: vendas com ganho de capital > R$ 35k/mês pagam 15%
    if (grossValue > 35000 && grossProfit > 0) {
      irAmount = grossProfit * 0.15;
    }
  } else if (product.category === 'fundos') {
    const irRate = getFixedIncomeIRRate(daysHeld);
    irAmount = grossProfit * irRate;
  }

  const totalTax = iofAmount + irAmount;
  const netValue = Math.max(0, grossValue - totalTax);
  const netProfit = netValue - position.amountInvested;
  const effectiveTaxRate = grossProfit > 0 ? (totalTax / grossProfit) * 100 : 0;

  let explanation = '';
  if (product.isTaxExempt) {
    explanation = `${product.name} é isento de Imposto de Renda para pessoa física (incentivo legal ao setor agro/imobiliário).`;
  } else if (iofAmount > 0) {
    explanation = `Aplicação com menos de 30 dias (${daysHeld} dias): sofreu IOF de ${(getIOFRate(daysHeld) * 100).toFixed(0)}% antes do IR. Mantenha por mais de 30 dias para isenção total de IOF!`;
  } else {
    explanation = `Tributado na tabela regressiva de IR (${daysHeld} dias decorridos, alíquota de ${(getFixedIncomeIRRate(daysHeld) * 100).toFixed(1)}% sobre o rendimento).`;
  }

  return {
    grossValue,
    grossProfit,
    iofAmount,
    irAmount,
    totalTax,
    netValue,
    netProfit,
    effectiveTaxRate,
    explanation,
  };
}

/**
 * Atualiza o valor diário de todos os investimentos do catálogo e as posições do jogador.
 * Inclui marcação a mercado (MTM), flutuações de ações/cripto, dividendos e juros.
 */
export function simulateMarketDailyStep(
  catalog: InvestmentProduct[],
  userPositions: UserPosition[],
  macro: MacroIndicators,
  currentDay: number,
  eventsMultiplierMap: Map<string, number>
): {
  updatedCatalog: InvestmentProduct[];
  updatedPositions: UserPosition[];
  totalGrossYieldToday: number;
  totalDividendsEarnedToday: number;
  reportNotes: string[];
} {
  const reportNotes: string[] = [];
  let totalGrossYieldToday = 0;
  let totalDividendsEarnedToday = 0;

  // 1. Atualizar o catálogo de preços unitários
  const updatedCatalog = catalog.map((product) => {
    let newPrice = product.currentUnitPrice;
    const history = [...product.priceHistory];

    switch (product.annualRateType) {
      case 'selic': {
        const dailyRate = annualToDailyRate(macro.selicRate);
        newPrice = newPrice * (1 + dailyRate);
        break;
      }
      case 'cdi_percent': {
        const effectiveAnnual = macro.cdiRate * (product.cdiMultiplier ?? 1.0);
        const dailyRate = annualToDailyRate(effectiveAnnual);
        newPrice = newPrice * (1 + dailyRate);
        break;
      }
      case 'prefixado': {
        // Se houver marcação a mercado (MTM), o preço do título varia com as mudanças na taxa de mercado
        // Ex: Se Selic subir, preço do título antigo cai temporariamente antes do vencimento
        const baseDaily = annualToDailyRate(product.baseAnnualRate);
        let mtmFactor = 1.0;
        if (product.hasMarkToMarket) {
          // Diferencial entre taxa contratada e taxa básica atual
          const diffRate = product.baseAnnualRate - macro.selicRate;
          mtmFactor = 1 + (diffRate * 0.05); // sensibilidade de duration didática
        }
        newPrice = newPrice * (1 + baseDaily * mtmFactor);
        break;
      }
      case 'ipca_plus': {
        // IPCA diário + cupom real diário
        const dailyInflation = annualToDailyRate(macro.ipcaAnnual);
        const dailyCoupon = annualToDailyRate(product.fixedSpread ?? 0.06);
        const combinedRate = (1 + dailyInflation) * (1 + dailyCoupon) - 1;
        newPrice = newPrice * (1 + combinedRate);
        break;
      }
      case 'variavel': {
        // Ações, FIIs e Criptoativos têm oscilação realista com volatilidade
        const vol = product.dailyVolatility ?? 0.015;
        // Ruído gaussiano aproximado (-1 a +1 com tendência do sentimento)
        const sentimentBias = macro.marketSentiment === 'otimista' ? 0.003 :
                              macro.marketSentiment === 'em_crise' ? -0.008 :
                              macro.marketSentiment === 'cauteloso' ? -0.002 : 0.0;
        
        // Evento específico afetando esse ativo
        const eventFactor = eventsMultiplierMap.get(product.id) ?? 1.0;
        const randomFactor = (Math.random() - 0.49) * 2 * vol;
        const dailyVariation = randomFactor + sentimentBias + (eventFactor - 1.0);
        
        newPrice = Math.max(0.1, newPrice * (1 + dailyVariation));
        break;
      }
    }

    history.push(Number(newPrice.toFixed(4)));
    if (history.length > 30) history.shift();

    return {
      ...product,
      currentUnitPrice: Number(newPrice.toFixed(4)),
      priceHistory: history,
    };
  });

  // 2. Atualizar as posições ativas do usuário
  const updatedPositions = userPositions.map((pos) => {
    const product = updatedCatalog.find((p) => p.id === pos.productId);
    if (!product) return pos;

    const previousValue = pos.currentValue;
    const newCurrentValue = pos.quantity * product.currentUnitPrice;
    const dayGain = newCurrentValue - previousValue;
    totalGrossYieldToday += dayGain;

    let dividendsToday = 0;
    // Se o produto distribui proventos (FIIs e Ações com dividend yield mensal configurado)
    // A cada 15 dias de simulação, paga dividendo proporcional
    if (product.dividendYieldMonthly && currentDay % 15 === 0 && pos.quantity > 0) {
      dividendsToday = pos.currentValue * (product.dividendYieldMonthly / 2);
      totalDividendsEarnedToday += dividendsToday;
      reportNotes.push(`Proventos recebidos: R$ ${dividendsToday.toFixed(2)} de ${product.code} creditados no seu caixa.`);
    }

    // Calcula valor líquido estimado com impostos vigentes
    const breakdown = calculateLiquidationBreakdown(
      { ...pos, currentValue: newCurrentValue },
      product,
      currentDay
    );

    return {
      ...pos,
      currentValue: Number(newCurrentValue.toFixed(2)),
      accumulatedGrossEarnings: Number((pos.accumulatedGrossEarnings + dayGain).toFixed(2)),
      accumulatedDividends: Number((pos.accumulatedDividends + dividendsToday).toFixed(2)),
      estimatedNetValue: Number(breakdown.netValue.toFixed(2)),
    };
  });

  return {
    updatedCatalog,
    updatedPositions,
    totalGrossYieldToday: Number(totalGrossYieldToday.toFixed(2)),
    totalDividendsEarnedToday: Number(totalDividendsEarnedToday.toFixed(2)),
    reportNotes,
  };
}

/**
 * Retorna o cálculo completo do patrimônio líquido do jogador,
 * garantindo ausência de dupla contagem e segregação de contas.
 */
export function calculateNetWorth(state: {
  cashAvailable: number;
  emergencyReserve: number;
  userPositions: UserPosition[];
  farmLandValue: number;
  toolsEquipmentValue: number;
  debts: number;
}): {
  netWorth: number;
  investedCurrentValue: number;
  investedGrossGains: number;
  farmTotalAssetValue: number;
} {
  const investedCurrentValue = state.userPositions.reduce((acc, pos) => acc + pos.currentValue, 0);
  const investedGrossGains = state.userPositions.reduce((acc, pos) => acc + (pos.currentValue - pos.amountInvested), 0);
  const farmTotalAssetValue = state.farmLandValue + state.toolsEquipmentValue;

  const netWorth =
    state.cashAvailable +
    state.emergencyReserve +
    investedCurrentValue +
    farmTotalAssetValue -
    state.debts;

  return {
    netWorth: Number(netWorth.toFixed(2)),
    investedCurrentValue: Number(investedCurrentValue.toFixed(2)),
    investedGrossGains: Number(investedGrossGains.toFixed(2)),
    farmTotalAssetValue: Number(farmTotalAssetValue.toFixed(2)),
  };
}
