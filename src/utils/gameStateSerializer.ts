import { GameState, Plot, Mission, Achievement } from '../types/game';
import { INITIAL_INVESTMENTS, INITIAL_ACHIEVEMENTS } from '../constants/gameData';
import { INITIAL_CROPS } from './farmEngine';
import { INITIAL_MISSIONS } from './missionEvaluator';

export const INITIAL_PLOTS: Plot[] = [
  { id: 1, crop: 'hortalicas', stage: 'crescendo', daysPlanted: 1, waterLevel: 80, nutrientLevel: 80, pestInfestation: false, lastWateredDay: 1, lastFertilizedDay: 1 },
  { id: 2, crop: 'milho', stage: 'plantado', daysPlanted: 0, waterLevel: 75, nutrientLevel: 70, pestInfestation: false, lastWateredDay: 1, lastFertilizedDay: 1 },
  { id: 3, crop: null, stage: 'vazio', daysPlanted: 0, waterLevel: 50, nutrientLevel: 60, pestInfestation: false, lastWateredDay: 0, lastFertilizedDay: 0 },
  { id: 4, crop: null, stage: 'vazio', daysPlanted: 0, waterLevel: 50, nutrientLevel: 60, pestInfestation: false, lastWateredDay: 0, lastFertilizedDay: 0 },
];

export const INITIAL_GAME_STATE: GameState = {
  version: '2.1',
  gameMode: 'aprendizagem',
  day: 1,
  energy: 6,
  maxEnergy: 6,
  playerLevel: 1,
  playerXp: 0,
  xpForNextLevel: 100,

  cashAvailable: 500.0,
  emergencyReserve: 0.0,
  debts: 0.0,
  farmLandValue: 2000.0,
  toolsEquipmentValue: 500.0,

  plots: INITIAL_PLOTS,
  inventory: {
    hortalicas: { cropId: 'hortalicas', amount: 5, reservedSeeds: 2 },
    milho: { cropId: 'milho', amount: 0, reservedSeeds: 3 },
    feijao: { cropId: 'feijao', amount: 0, reservedSeeds: 0 },
    soja: { cropId: 'soja', amount: 0, reservedSeeds: 0 },
    trigo: { cropId: 'trigo', amount: 0, reservedSeeds: 0 },
    cafe: { cropId: 'cafe', amount: 0, reservedSeeds: 0 },
  },
  cropMarket: INITIAL_CROPS,

  macro: {
    selicRate: 0.1075,
    cdiRate: 0.1065,
    ipcaAnnual: 0.045,
    marketSentiment: 'neutro',
    inflationAccumulatedGame: 0.0,
  },
  investmentsCatalog: INITIAL_INVESTMENTS,
  userPositions: [],

  transactionHistory: [
    {
      id: 'tx_init_1',
      day: 1,
      type: 'receita_agricola',
      category: 'fazenda',
      description: 'Capital inicial do pequeno agricultor',
      amount: 500,
      netImpact: 500,
      details: 'Recursos próprios para iniciar o cultivo sustentável e formar reservas.',
    },
  ],
  dailyReports: [],
  lastDailyReport: null,
  activeEvents: [],
  missions: INITIAL_MISSIONS,
  achievements: INITIAL_ACHIEVEMENTS,

  totalHarvestsCount: 0,
  totalGrainSoldValue: 0,
  totalDividendsEarned: 0,
  totalTaxesPaid: 0,
  consecutiveDaysPlanned: 0,
};

/**
 * Sanitiza o estado para que possa ser salvo com 100% de segurança no Cloud Firestore e LocalStorage.
 * Remove funções, undefineds, referências circulares e propriedades inválidas.
 */
export function sanitizeGameState(state: GameState): Record<string, any> {
  const cleanMissions = (state.missions || []).map(({ conditionCheck, ...rest }) => rest);

  const cleanObject = {
    version: state.version || '2.1',
    gameMode: state.gameMode || 'aprendizagem',
    day: Number.isFinite(state.day) ? state.day : 1,
    energy: Number.isFinite(state.energy) ? state.energy : 6,
    maxEnergy: Number.isFinite(state.maxEnergy) ? state.maxEnergy : 6,
    playerLevel: Number.isFinite(state.playerLevel) ? state.playerLevel : 1,
    playerXp: Number.isFinite(state.playerXp) ? state.playerXp : 0,
    xpForNextLevel: Number.isFinite(state.xpForNextLevel) ? state.xpForNextLevel : 100,

    cashAvailable: Number.isFinite(state.cashAvailable) ? state.cashAvailable : 500,
    emergencyReserve: Number.isFinite(state.emergencyReserve) ? state.emergencyReserve : 0,
    debts: Number.isFinite(state.debts) ? state.debts : 0,
    farmLandValue: Number.isFinite(state.farmLandValue) ? state.farmLandValue : 2000,
    toolsEquipmentValue: Number.isFinite(state.toolsEquipmentValue) ? state.toolsEquipmentValue : 500,

    plots: state.plots || INITIAL_PLOTS,
    inventory: state.inventory || INITIAL_GAME_STATE.inventory,
    cropMarket: state.cropMarket || INITIAL_CROPS,
    macro: state.macro || INITIAL_GAME_STATE.macro,
    investmentsCatalog: state.investmentsCatalog || INITIAL_INVESTMENTS,
    userPositions: state.userPositions || [],

    transactionHistory: (state.transactionHistory || []).slice(0, 100), // Manter as últimas 100 transações
    dailyReports: (state.dailyReports || []).slice(-30), // Manter últimos 30 relatórios
    lastDailyReport: state.lastDailyReport || null,
    activeEvents: state.activeEvents || [],

    missions: cleanMissions,
    achievements: state.achievements || INITIAL_ACHIEVEMENTS,

    totalHarvestsCount: Number.isFinite(state.totalHarvestsCount) ? state.totalHarvestsCount : 0,
    totalGrainSoldValue: Number.isFinite(state.totalGrainSoldValue) ? state.totalGrainSoldValue : 0,
    totalDividendsEarned: Number.isFinite(state.totalDividendsEarned) ? state.totalDividendsEarned : 0,
    totalTaxesPaid: Number.isFinite(state.totalTaxesPaid) ? state.totalTaxesPaid : 0,
    consecutiveDaysPlanned: Number.isFinite(state.consecutiveDaysPlanned) ? state.consecutiveDaysPlanned : 0,
  };

  // Garante que é JSON serializável puro
  return JSON.parse(JSON.stringify(cleanObject));
}

/**
 * Reconstrói o GameState completo a partir de um documento do Firestore ou cache local.
 */
export function hydrateGameState(raw: any): GameState {
  if (!raw || typeof raw !== 'object') {
    return INITIAL_GAME_STATE;
  }

  // Se o objeto estiver aninhado dentro de { gameState: ... }
  const data = raw.gameState && typeof raw.gameState === 'object' ? raw.gameState : raw;

  // Reconcilia missões salvas com a lista padrão
  const savedMissions: Mission[] = Array.isArray(data.missions) ? data.missions : [];
  const mergedMissions: Mission[] = INITIAL_MISSIONS.map((initialM) => {
    const saved = savedMissions.find((sm) => sm.id === initialM.id);
    if (saved) {
      return {
        ...initialM,
        completed: Boolean(saved.completed),
        progress: Number.isFinite(saved.progress) ? saved.progress : saved.completed ? 100 : 0,
        isUnlocked: saved.isUnlocked !== undefined ? Boolean(saved.isUnlocked) : initialM.isUnlocked,
      };
    }
    return initialM;
  });

  // Reconcilia conquistas salvas
  const savedAchievements: Achievement[] = Array.isArray(data.achievements) ? data.achievements : [];
  const mergedAchievements: Achievement[] = INITIAL_ACHIEVEMENTS.map((initialAch) => {
    const saved = savedAchievements.find((sa) => sa.id === initialAch.id);
    if (saved) {
      return {
        ...initialAch,
        unlockedAtDay: saved.unlockedAtDay !== undefined ? saved.unlockedAtDay : initialAch.unlockedAtDay,
      };
    }
    return initialAch;
  });

  return {
    version: data.version || '2.1',
    gameMode: data.gameMode || 'aprendizagem',
    day: Number.isFinite(data.day) ? data.day : 1,
    energy: Number.isFinite(data.energy) ? data.energy : 6,
    maxEnergy: Number.isFinite(data.maxEnergy) ? data.maxEnergy : 6,
    playerLevel: Number.isFinite(data.playerLevel) ? data.playerLevel : 1,
    playerXp: Number.isFinite(data.playerXp) ? data.playerXp : 0,
    xpForNextLevel: Number.isFinite(data.xpForNextLevel) ? data.xpForNextLevel : 100,

    cashAvailable: Number.isFinite(data.cashAvailable) ? data.cashAvailable : 500,
    emergencyReserve: Number.isFinite(data.emergencyReserve) ? data.emergencyReserve : 0,
    debts: Number.isFinite(data.debts) ? data.debts : 0,
    farmLandValue: Number.isFinite(data.farmLandValue) ? data.farmLandValue : 2000,
    toolsEquipmentValue: Number.isFinite(data.toolsEquipmentValue) ? data.toolsEquipmentValue : 500,

    plots: Array.isArray(data.plots) && data.plots.length > 0 ? data.plots : INITIAL_PLOTS,
    inventory: data.inventory && typeof data.inventory === 'object' ? data.inventory : INITIAL_GAME_STATE.inventory,
    cropMarket: data.cropMarket && typeof data.cropMarket === 'object' ? data.cropMarket : INITIAL_CROPS,
    macro: data.macro && typeof data.macro === 'object' ? data.macro : INITIAL_GAME_STATE.macro,
    investmentsCatalog: Array.isArray(data.investmentsCatalog) && data.investmentsCatalog.length > 0
      ? data.investmentsCatalog
      : INITIAL_INVESTMENTS,
    userPositions: Array.isArray(data.userPositions) ? data.userPositions : [],

    transactionHistory: Array.isArray(data.transactionHistory) ? data.transactionHistory : INITIAL_GAME_STATE.transactionHistory,
    dailyReports: Array.isArray(data.dailyReports) ? data.dailyReports : [],
    lastDailyReport: data.lastDailyReport || null,
    activeEvents: Array.isArray(data.activeEvents) ? data.activeEvents : [],

    missions: mergedMissions,
    achievements: mergedAchievements,

    totalHarvestsCount: Number.isFinite(data.totalHarvestsCount) ? data.totalHarvestsCount : 0,
    totalGrainSoldValue: Number.isFinite(data.totalGrainSoldValue) ? data.totalGrainSoldValue : 0,
    totalDividendsEarned: Number.isFinite(data.totalDividendsEarned) ? data.totalDividendsEarned : 0,
    totalTaxesPaid: Number.isFinite(data.totalTaxesPaid) ? data.totalTaxesPaid : 0,
    consecutiveDaysPlanned: Number.isFinite(data.consecutiveDaysPlanned) ? data.consecutiveDaysPlanned : 0,
  };
}
