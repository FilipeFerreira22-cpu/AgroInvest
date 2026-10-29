export type GameMode = 'aprendizagem' | 'realista' | 'desafio';

export type CropType = 'milho' | 'feijao' | 'soja' | 'trigo' | 'hortalicas' | 'cafe';

export interface CropDefinition {
  id: CropType;
  name: string;
  icon: string;
  seedCost: number; // Custo de compra da semente por lote
  growthDays: number; // Dias até ficar pronto
  waterRequirement: number; // Nível ideal de água (1 a 10)
  nutrientRequirement: number; // Nível ideal de adubo (1 a 10)
  baseYield: number; // Sacas ou caixas produzidas por lote
  unitName: string; // Ex: 'sacas', 'caixas'
  basePrice: number; // Preço base por unidade no mercado
  currentPrice: number; // Preço atual flutuante
  priceVolatility: number; // Variação diária possível
  minLevel: number; // Nível mínimo do jogador para desbloquear
  description: string;
  seedsPerCycle: number; // Quantas unidades da colheita precisa guardar para replantar 1 lote
  pestResistance: number; // 0 a 100
}

export interface Plot {
  id: number;
  crop: CropType | null;
  stage: 'vazio' | 'plantado' | 'crescendo' | 'maduro' | 'colhido' | 'doente';
  daysPlanted: number;
  waterLevel: number; // 0 a 100%
  nutrientLevel: number; // 0 a 100%
  pestInfestation: boolean; // Presença de pragas
  lastWateredDay: number;
  lastFertilizedDay: number;
}

export interface InventoryItem {
  cropId: CropType;
  amount: number; // Quantidade colhida em estoque
  reservedSeeds: number; // Quantidade reservada estritamente para o próximo plantio
}

export type InvestmentCategory = 'tesouro' | 'renda_fixa' | 'acoes' | 'fiis' | 'cripto' | 'fundos';

export interface InvestmentProduct {
  id: string;
  name: string;
  code: string;
  category: InvestmentCategory;
  description: string;
  minInvestment: number;
  riskLevel: 'baixo' | 'medio' | 'alto' | 'muito_alto';
  liquidity: 'D+0' | 'D+1' | 'no_vencimento' | 'mensal';
  termDays: number; // Prazo do título em dias de simulação
  annualRateType: 'selic' | 'cdi_percent' | 'prefixado' | 'ipca_plus' | 'variavel';
  nominalRateText: string; // Ex: "100% do CDI", "11.75% a.a.", "IPCA + 6.2%", "Flutuante"
  baseAnnualRate: number; // Taxa anual decimal base (ex 0.1175 para 11.75%)
  cdiMultiplier?: number; // Ex: 1.10 para 110% do CDI
  fixedSpread?: number; // Ex: 0.062 para IPCA + 6.2%
  hasMarkToMarket: boolean; // Se sofre oscilação de preço na venda antecipada
  isTaxExempt: boolean; // Se é isento de IR (ex: LCI, LCA, FIIs rendimentos)
  hasIOF: boolean; // Se sofre IOF nos primeiros 30 dias
  hasFGC: boolean; // Coberto pelo Fundo Garantidor de Créditos
  issuer: string; // Emissor (Governo Federal, Banco Solidez, Cooperativa Agro, etc.)
  currentUnitPrice: number; // Preço unitário da cota/título
  initialUnitPrice: number;
  priceHistory: number[]; // Histórico de preços para gráficos/sparklines
  dividendYieldMonthly?: number; // Rendimento mensal distribuído (FIIs e Ações)
  dailyVolatility?: number; // Desvio padrão diário para ativos de risco
  companyDetails?: {
    sector: string;
    peRatio: number; // P/L
    dividendYield: number; // DY anual %
    description: string;
  };
}

export interface UserPosition {
  id: string;
  productId: string;
  amountInvested: number; // Saldo de principal investido inicialmente
  quantity: number; // Quantidade de cotas ou títulos
  purchaseUnitPrice: number; // Preço médio pago
  purchaseDay: number;
  currentValue: number; // Valor bruto atual com juros e variações
  accumulatedGrossEarnings: number;
  accumulatedDividends: number;
  estimatedNetValue: number; // Valor líquido projetado caso resgate hoje (descontando IR/IOF)
}

export type TransactionType =
  | 'receita_agricola'
  | 'custo_agricola'
  | 'aporte_investimento'
  | 'resgate_investimento'
  | 'dividendo'
  | 'reserva_deposito'
  | 'reserva_retirada'
  | 'recompensa_missao';

export type TransactionCategory = 'fazenda' | 'investimento' | 'reserva' | 'outros';

export interface TransactionRecord {
  id: string;
  day: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  netImpact: number; // Impacto no caixa disponível
  assetName?: string;
  details?: string;
}

export interface MacroIndicators {
  selicRate: number; // a.a. ex: 0.1075 (10.75%)
  cdiRate: number; // a.a. ex: 0.1065 (10.65%)
  ipcaAnnual: number; // a.a. ex: 0.0450 (4.50%)
  marketSentiment: 'otimista' | 'neutro' | 'cauteloso' | 'em_crise';
  inflationAccumulatedGame: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'clima' | 'economia' | 'mercado_agricola' | 'empresa';
  impactExplanation: string;
  actionRecommendation: string;
  affectedCrops?: CropType[];
  cropPriceMultiplier?: number;
  affectedInvestments?: string[];
  investmentMultiplier?: number;
  selicChange?: number;
  ipcaChange?: number;
}

export interface Mission {
  id: string;
  title: string;
  category: 'agricola' | 'reserva' | 'renda_fixa' | 'renda_variavel' | 'diversificacao';
  description: string;
  educationalGoal: string;
  completed: boolean;
  rewardCoins: number;
  rewardXp: number;
  requiredDay?: number;
  isUnlocked: boolean;
  progress: number; // 0 a 100%
  conditionCheck?: (state: GameState) => boolean;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAtDay: number | null;
  xpReward: number;
}

export interface DailyReport {
  day: number;
  farmRevenue: number;
  farmOperatingCosts: number;
  farmNetProfit: number;
  cropsHarvestedText: string;
  investmentsGrossGain: number;
  investmentsEstimatedTaxes: number;
  investmentsNetGain: number;
  dividendsReceived: number;
  previousNetWorth: number;
  currentNetWorth: number;
  netWorthChange: number;
  activeEvents: GameEvent[];
  educationalInsight: {
    title: string;
    explanation: string;
    source: string; // Ex: CVM, Banco Central, Tesouro Nacional, B3
    whyItHappened: string;
  };
  risksToWatch: string[];
}

export interface GameState {
  version: string;
  gameMode: GameMode;
  day: number;
  energy: number; // Energia diária de trabalho (ex: 5/5)
  maxEnergy: number;
  playerLevel: number;
  playerXp: number;
  xpForNextLevel: number;

  // Contas financeiras estritamente separadas
  cashAvailable: number; // Saldo em conta corrente disponível para uso imediato
  emergencyReserve: number; // Reserva de emergência separada
  debts: number; // Dívidas ou financiamentos
  farmLandValue: number; // Valor estimado da terra e infraestrutura
  toolsEquipmentValue: number; // Valor de tratores e implementos

  // Lotes agrícolas
  plots: Plot[];
  inventory: Record<CropType, InventoryItem>;
  cropMarket: Record<CropType, CropDefinition>;

  // Mercado Financeiro
  macro: MacroIndicators;
  investmentsCatalog: InvestmentProduct[];
  userPositions: UserPosition[];

  // Históricos e relatórios
  transactionHistory: TransactionRecord[];
  dailyReports: DailyReport[];
  lastDailyReport: DailyReport | null;
  activeEvents: GameEvent[];

  // Missões e Conquistas
  missions: Mission[];
  achievements: Achievement[];

  // Estatísticas acumuladas
  totalHarvestsCount: number;
  totalGrainSoldValue: number;
  totalDividendsEarned: number;
  totalTaxesPaid: number;
  consecutiveDaysPlanned: number;
}
