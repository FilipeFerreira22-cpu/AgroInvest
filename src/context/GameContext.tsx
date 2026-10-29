import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  CropType,
  GameMode,
  UserPosition,
  DailyReport,
  GameEvent,
  Plot,
  TransactionRecord,
} from '../types/game';
import { INITIAL_CROPS, calculatePlotHarvestYield, advancePlotsDay, simulateCropMarketDailyPrices } from '../utils/farmEngine';
import { INITIAL_INVESTMENTS, INITIAL_ACHIEVEMENTS, RANDOM_EVENTS } from '../constants/gameData';
import {
  calculateLiquidationBreakdown,
  simulateMarketDailyStep,
  calculateNetWorth,
} from '../utils/financeEngine';
import { loadGameStateFromStorage, saveGameStateToStorage, clearGameStateFromStorage } from '../utils/storage';
import { useAuth } from './AuthContext';
import { fetchPlayerGameSave, savePlayerGameSave } from '../services/firebase';
import { INITIAL_GAME_STATE, INITIAL_PLOTS } from '../utils/gameStateSerializer';
import { checkAllMissions } from '../utils/missionEvaluator';

const createTx = (tx: TransactionRecord): TransactionRecord => tx;

export { INITIAL_PLOTS };

export type SyncStatus = 'synced' | 'saving' | 'offline_cache' | 'error';

interface GameContextType {
  state: GameState;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  isGameLoading: boolean;
  saveNow: () => Promise<void>;
  plantPlot: (plotId: number, cropType: CropType) => { success: boolean; message: string };
  waterPlot: (plotId: number) => { success: boolean; message: string };
  waterAllPlots: () => { success: boolean; message: string };
  fertilizePlot: (plotId: number) => { success: boolean; message: string };
  fertilizeAllPlots: () => { success: boolean; message: string };
  treatPest: (plotId: number) => { success: boolean; message: string };
  harvestPlot: (plotId: number) => { success: boolean; message: string; yieldAmount?: number };
  harvestAllPlots: () => { success: boolean; message: string; totalYield?: number };
  expandPlots: () => { success: boolean; message: string };
  sellCrop: (cropType: CropType, amount: number) => { success: boolean; message: string; revenue?: number };
  setCropReservedSeeds: (cropType: CropType, amount: number) => { success: boolean; message: string };
  autoReserveSeeds: (cropType: CropType) => { success: boolean; message: string };
  depositEmergencyReserve: (amount: number) => { success: boolean; message: string };
  withdrawEmergencyReserve: (amount: number) => { success: boolean; message: string };
  buyInvestment: (productId: string, amount: number) => { success: boolean; message: string };
  sellInvestment: (positionId: string, quantityToSell?: number) => { success: boolean; message: string };
  advanceDay: () => { success: boolean; message: string; report?: DailyReport };
  claimMissionReward: (missionId: string) => { success: boolean; message: string };
  closeDailyReportModal: () => void;
  setGameMode: (mode: GameMode) => void;
  resetGame: () => void;
  showDailyReport: boolean;
  setShowDailyReport: (show: boolean) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isLoadedForUser, setIsLoadedForUser] = useState<string | null>(null);
  const [isGameLoading, setIsGameLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [showDailyReport, setShowDailyReport] = useState<boolean>(false);

  // Fila e timer de debounce para gravação em lote no Firestore
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  // Função centralizada para salvar o progresso (com suporte a imediato e debounced)
  const triggerSave = useCallback(
    async (stateToSave: GameState, isImmediate = false) => {
      if (!user || isLoadedForUser !== user.uid) return;

      // 1. Gravação local síncrona imediata no cache isolado do UID
      saveGameStateToStorage(stateToSave, user.uid);

      if (isImmediate) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        setSyncStatus('saving');
        try {
          await savePlayerGameSave(user.uid, stateToSave);
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
        } catch (err) {
          console.warn('[AgroInvest] Falha na sincronização remota (salvo em cache local):', err);
          setSyncStatus('offline_cache');
        }
      } else {
        setSyncStatus('saving');
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(async () => {
          debounceTimerRef.current = null;
          try {
            await savePlayerGameSave(user.uid, stateToSave);
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
          } catch (err) {
            console.warn('[AgroInvest] Falha temporária no autosave remoto (dados seguros no cache):', err);
            setSyncStatus('offline_cache');
          }
        }, 1200);
      }
    },
    [user, isLoadedForUser]
  );

  // Ação manual "Salvar Agora"
  const saveNow = useCallback(async () => {
    await triggerSave(stateRef.current, true);
  }, [triggerSave]);

  // Carrega a partida do jogador autenticado
  useEffect(() => {
    let isMounted = true;

    async function loadUserSave() {
      if (!user) {
        setState(INITIAL_GAME_STATE);
        setIsLoadedForUser(null);
        setIsGameLoading(false);
        setSyncStatus('synced');
        return;
      }

      setIsGameLoading(true);
      setSyncStatus('saving');

      try {
        // 1. Tenta carregar os dados mais recentes do Cloud Firestore
        const firestoreSave = await fetchPlayerGameSave(user.uid);
        if (firestoreSave && isMounted) {
          setState(firestoreSave);
          setIsLoadedForUser(user.uid);
          saveGameStateToStorage(firestoreSave, user.uid);
          setIsGameLoading(false);
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
          return;
        }

        // 2. Se não encontrou no Firestore, busca no backup local resiliente deste UID
        const localSave = loadGameStateFromStorage(user.uid);
        if (localSave && isMounted) {
          setState(localSave);
          setIsLoadedForUser(user.uid);
          setIsGameLoading(false);
          setSyncStatus('offline_cache');
          setLastSyncedAt(new Date());

          // Sincroniza o backup local de volta com o Cloud Firestore
          savePlayerGameSave(user.uid, localSave)
            .then(() => {
              if (isMounted) setSyncStatus('synced');
            })
            .catch(() => {
              if (isMounted) setSyncStatus('offline_cache');
            });
          return;
        }

        // 3. Conta nova (primeiro acesso deste UID): inicializa fazenda e salva imediatamente
        if (isMounted) {
          const fresh = { ...INITIAL_GAME_STATE };
          setState(fresh);
          setIsLoadedForUser(user.uid);
          setIsGameLoading(false);
          saveGameStateToStorage(fresh, user.uid);
          savePlayerGameSave(user.uid, fresh)
            .then(() => {
              if (isMounted) {
                setSyncStatus('synced');
                setLastSyncedAt(new Date());
              }
            })
            .catch(() => {
              if (isMounted) setSyncStatus('offline_cache');
            });
        }
      } catch (err) {
        console.error('Erro ao carregar partida do jogador:', err);
        const localSave = loadGameStateFromStorage(user.uid);
        if (localSave && isMounted) {
          setState(localSave);
          setSyncStatus('offline_cache');
        } else if (isMounted) {
          setState(INITIAL_GAME_STATE);
          setSyncStatus('error');
        }
        if (isMounted) {
          setIsLoadedForUser(user.uid);
          setIsGameLoading(false);
        }
      }
    }

    loadUserSave();

    return () => {
      isMounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user?.uid]);

  // Persistência contínua com debounce para alterações graduais de estado
  useEffect(() => {
    if (user && isLoadedForUser === user.uid && !isGameLoading) {
      triggerSave(state, false);
    }
  }, [state, user?.uid, isLoadedForUser, isGameLoading, triggerSave]);

  // Sincronização de segurança ao fechar janela / aba
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user && isLoadedForUser === user.uid) {
        saveGameStateToStorage(stateRef.current, user.uid);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, isLoadedForUser]);

  // Função auxiliar para adicionar XP e checar level-up
  const addPlayerXp = useCallback((currentXp: number, currentLevel: number, xpGain: number) => {
    let newXp = currentXp + xpGain;
    let newLevel = currentLevel;
    let required = newLevel * 100;

    while (newXp >= required) {
      newXp -= required;
      newLevel++;
      required = newLevel * 100;
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    return { newXp, newLevel, required };
  }, []);

  // --- AÇÕES AGRÍCOLAS ---

  const plantPlot = useCallback((plotId: number, cropType: CropType) => {
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot) return { success: false, message: 'Canteiro não encontrado.' };
    if (plot.crop !== null && plot.stage !== 'vazio') return { success: false, message: 'Canteiro já está ocupado.' };

    const cropDef = state.cropMarket[cropType];
    if (state.playerLevel < cropDef.minLevel) {
      return { success: false, message: `Necessário nível ${cropDef.minLevel} para plantar ${cropDef.name}.` };
    }

    const inventoryItem = state.inventory[cropType];
    const hasReservedSeed = inventoryItem.reservedSeeds >= cropDef.seedsPerCycle;
    const cost = hasReservedSeed ? 0 : cropDef.seedCost;

    if (!hasReservedSeed && state.cashAvailable < cost) {
      return { success: false, message: `Saldo insuficiente (R$ ${cost.toFixed(2)} necessário para sementes).` };
    }

    if (state.energy < 1) {
      return { success: false, message: 'Sem energia suficiente para plantar hoje. Descanse ou avance o dia.' };
    }

    setState((prev) => {
      const updatedPlots = prev.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              crop: cropType,
              stage: 'plantado' as const,
              daysPlanted: 0,
              pestInfestation: false,
              lastWateredDay: prev.day,
            }
          : p
      );

      const updatedInventory = { ...prev.inventory };
      let newCash = prev.cashAvailable;

      if (hasReservedSeed) {
        updatedInventory[cropType] = {
          ...inventoryItem,
          reservedSeeds: inventoryItem.reservedSeeds - cropDef.seedsPerCycle,
        };
      } else {
        newCash -= cost;
      }

      const txHistory = hasReservedSeed
        ? prev.transactionHistory
        : [
            {
              id: `tx_${Date.now()}`,
              day: prev.day,
              type: 'custo_agricola' as const,
              category: 'fazenda' as const,
              description: `Compra de sementes para ${cropDef.name}`,
              amount: cost,
              netImpact: -cost,
            },
            ...prev.transactionHistory,
          ];

      return {
        ...prev,
        plots: updatedPlots,
        inventory: updatedInventory,
        cashAvailable: Number(newCash.toFixed(2)),
        energy: prev.energy - 1,
        transactionHistory: txHistory.slice(0, 100),
      };
    });

    return {
      success: true,
      message: hasReservedSeed
        ? `Plantou ${cropDef.name} utilizando sementes próprias reservadas (Custo R$ 0)!`
        : `Plantou ${cropDef.name} por R$ ${cost.toFixed(2)}.`,
    };
  }, [state]);

  const waterPlot = useCallback((plotId: number) => {
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot) return { success: false, message: 'Canteiro não encontrado.' };
    if (state.energy < 1) return { success: false, message: 'Sem energia de trabalho hoje.' };

    setState((prev) => ({
      ...prev,
      plots: prev.plots.map((p) =>
        p.id === plotId
          ? { ...p, waterLevel: 100, lastWateredDay: prev.day }
          : p
      ),
      energy: prev.energy - 1,
    }));

    return { success: true, message: 'Canteiro irrigado com sucesso!' };
  }, [state]);

  const waterAllPlots = useCallback(() => {
    const needsWater = state.plots.filter((p) => p.crop !== null && p.waterLevel < 70);
    if (needsWater.length === 0) return { success: false, message: 'Todos os canteiros cultivados já estão bem irrigados!' };
    if (state.energy < 1) return { success: false, message: 'Sem energia suficiente.' };

    setState((prev) => ({
      ...prev,
      plots: prev.plots.map((p) =>
        p.crop !== null ? { ...p, waterLevel: 100, lastWateredDay: prev.day } : p
      ),
      energy: Math.max(0, prev.energy - 1),
    }));

    return { success: true, message: 'Todos os canteiros irrigados!' };
  }, [state]);

  const fertilizePlot = useCallback((plotId: number) => {
    const fertilizerCost = 15;
    if (state.cashAvailable < fertilizerCost) return { success: false, message: 'Saldo insuficiente para fertilizante (R$ 15).' };
    if (state.energy < 1) return { success: false, message: 'Sem energia de trabalho.' };

    setState((prev) => ({
      ...prev,
      cashAvailable: Number((prev.cashAvailable - fertilizerCost).toFixed(2)),
      plots: prev.plots.map((p) =>
        p.id === plotId ? { ...p, nutrientLevel: 100, lastFertilizedDay: prev.day } : p
      ),
      energy: prev.energy - 1,
      transactionHistory: [
        createTx({
          id: `tx_${Date.now()}`,
          day: prev.day,
          type: 'custo_agricola',
          category: 'fazenda',
          description: 'Adubação e enriquecimento do solo',
          amount: fertilizerCost,
          netImpact: -fertilizerCost,
        }),
        ...prev.transactionHistory,
      ].slice(0, 100),
    }));

    return { success: true, message: 'Solo adubado e enriquecido (+100% nutrientes)!' };
  }, [state]);

  const fertilizeAllPlots = useCallback(() => {
    const cultivated = state.plots.filter((p) => p.crop !== null && p.nutrientLevel < 70);
    if (cultivated.length === 0) return { success: false, message: 'Nenhum canteiro precisa de adubação urgente.' };
    const totalCost = cultivated.length * 15;
    if (state.cashAvailable < totalCost) return { success: false, message: `Saldo insuficiente (R$ ${totalCost} necessário).` };
    if (state.energy < 1) return { success: false, message: 'Sem energia disponível.' };

    setState((prev) => ({
      ...prev,
      cashAvailable: Number((prev.cashAvailable - totalCost).toFixed(2)),
      plots: prev.plots.map((p) =>
        p.crop !== null ? { ...p, nutrientLevel: 100, lastFertilizedDay: prev.day } : p
      ),
      energy: Math.max(0, prev.energy - 1),
      transactionHistory: [
        createTx({
          id: `tx_${Date.now()}`,
          day: prev.day,
          type: 'custo_agricola',
          category: 'fazenda',
          description: `Adubação em lote (${cultivated.length} canteiros)`,
          amount: totalCost,
          netImpact: -totalCost,
        }),
        ...prev.transactionHistory,
      ].slice(0, 100),
    }));

    return { success: true, message: `Todos os canteiros foram adubados por R$ ${totalCost.toFixed(2)}!` };
  }, [state]);

  const treatPest = useCallback((plotId: number) => {
    const cost = 25;
    if (state.cashAvailable < cost) return { success: false, message: 'Saldo insuficiente para controle fitossanitário (R$ 25).' };
    if (state.energy < 1) return { success: false, message: 'Sem energia de trabalho.' };

    setState((prev) => ({
      ...prev,
      cashAvailable: Number((prev.cashAvailable - cost).toFixed(2)),
      plots: prev.plots.map((p) =>
        p.id === plotId ? { ...p, pestInfestation: false } : p
      ),
      energy: prev.energy - 1,
      transactionHistory: [
        createTx({
          id: `tx_${Date.now()}`,
          day: prev.day,
          type: 'custo_agricola',
          category: 'fazenda',
          description: 'Manejo integrado e combate biológico a pragas',
          amount: cost,
          netImpact: -cost,
        }),
        ...prev.transactionHistory,
      ].slice(0, 100),
    }));

    return { success: true, message: 'Pragas eliminadas com sucesso!' };
  }, [state]);

  const harvestPlot = useCallback((plotId: number) => {
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot || !plot.crop) return { success: false, message: 'Canteiro vazio.' };
    if (plot.stage !== 'maduro') return { success: false, message: 'A cultura ainda não amadureceu completamente.' };
    if (state.energy < 1) return { success: false, message: 'Sem energia para colher hoje.' };

    const cropDef = state.cropMarket[plot.crop];
    const { yieldAmount, qualityRating } = calculatePlotHarvestYield(plot, cropDef);

    setState((prev) => {
      const updatedPlots = prev.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              crop: null,
              stage: 'vazio' as const,
              daysPlanted: 0,
              waterLevel: 50,
              nutrientLevel: Math.max(20, p.nutrientLevel - 30),
              pestInfestation: false,
            }
          : p
      );

      const currentInv = prev.inventory[cropDef.id];
      const updatedInv = {
        ...prev.inventory,
        [cropDef.id]: {
          ...currentInv,
          amount: currentInv.amount + yieldAmount,
        },
      };

      const xpGain = 20;
      const { newXp, newLevel, required } = addPlayerXp(prev.playerXp, prev.playerLevel, xpGain);

      return {
        ...prev,
        plots: updatedPlots,
        inventory: updatedInv,
        energy: prev.energy - 1,
        totalHarvestsCount: prev.totalHarvestsCount + 1,
        playerXp: newXp,
        playerLevel: newLevel,
        xpForNextLevel: required,
      };
    });

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    return {
      success: true,
      message: `Colheita de ${cropDef.name} finalizada! Produziu ${yieldAmount} ${cropDef.unitName} (Qualidade: ${qualityRating}).`,
      yieldAmount,
    };
  }, [state, addPlayerXp]);

  const harvestAllPlots = useCallback(() => {
    const maturePlots = state.plots.filter((p) => p.crop !== null && p.stage === 'maduro');
    if (maturePlots.length === 0) return { success: false, message: 'Não há canteiros maduros para colher.' };
    if (state.energy < 1) return { success: false, message: 'Sem energia de trabalho.' };

    let totalHarvested = 0;

    setState((prev) => {
      const updatedPlots = prev.plots.map((p) => {
        if (p.crop !== null && p.stage === 'maduro') {
          return {
            ...p,
            crop: null,
            stage: 'vazio' as const,
            daysPlanted: 0,
            waterLevel: 50,
            nutrientLevel: Math.max(20, p.nutrientLevel - 30),
            pestInfestation: false,
          };
        }
        return p;
      });

      const updatedInv = { ...prev.inventory };

      maturePlots.forEach((plot) => {
        if (!plot.crop) return;
        const cropDef = prev.cropMarket[plot.crop];
        const { yieldAmount } = calculatePlotHarvestYield(plot, cropDef);
        totalHarvested += yieldAmount;
        updatedInv[plot.crop] = {
          ...updatedInv[plot.crop],
          amount: updatedInv[plot.crop].amount + yieldAmount,
        };
      });

      const xpGain = maturePlots.length * 20;
      const { newXp, newLevel, required } = addPlayerXp(prev.playerXp, prev.playerLevel, xpGain);

      return {
        ...prev,
        plots: updatedPlots,
        inventory: updatedInv,
        energy: Math.max(0, prev.energy - 1),
        totalHarvestsCount: prev.totalHarvestsCount + maturePlots.length,
        playerXp: newXp,
        playerLevel: newLevel,
        xpForNextLevel: required,
      };
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    return {
      success: true,
      message: `Colheita coletiva concluída! ${maturePlots.length} canteiros colhidos (${totalHarvested} unidades no armazém).`,
      totalYield: totalHarvested,
    };
  }, [state, addPlayerXp]);

  const expandPlots = useCallback(() => {
    const cost = 800;
    if (state.cashAvailable < cost) {
      return { success: false, message: `Saldo insuficiente para preparar novo canteiro (R$ ${cost.toFixed(2)} necessário).` };
    }
    if (state.plots.length >= 8) {
      return { success: false, message: 'A fazenda atingiu a capacidade máxima de expansão nesta fase (8 canteiros).' };
    }

    setState((prev) => {
      const newPlotId = prev.plots.length + 1;
      const newPlot: Plot = {
        id: newPlotId,
        crop: null,
        stage: 'vazio',
        daysPlanted: 0,
        waterLevel: 50,
        nutrientLevel: 70,
        pestInfestation: false,
        lastWateredDay: 0,
        lastFertilizedDay: 0,
      };

      return {
        ...prev,
        cashAvailable: Number((prev.cashAvailable - cost).toFixed(2)),
        farmLandValue: prev.farmLandValue + 500, // Valoriza o patrimônio da fazenda
        plots: [...prev.plots, newPlot],
        transactionHistory: [
          createTx({
            id: `tx_${Date.now()}`,
            day: prev.day,
            type: 'custo_agricola',
            category: 'fazenda',
            description: `Abertura e nivelamento do Canteiro #${newPlotId}`,
            amount: cost,
            netImpact: -cost,
          }),
          ...prev.transactionHistory,
        ].slice(0, 100),
      };
    });

    confetti({ particleCount: 40, spread: 60 });
    return { success: true, message: 'Novo canteiro preparado! A terra produtiva foi expandida e seu patrimônio valorizou.' };
  }, [state]);

  // --- ARMAZÉM E MERCADO AGRÍCOLA ---

  const sellCrop = useCallback((cropType: CropType, amount: number) => {
    const item = state.inventory[cropType];
    const cropDef = state.cropMarket[cropType];

    // O jogador pode vender apenas o estoque livre (amount - reservedSeeds)
    const availableToSell = Math.max(0, item.amount - item.reservedSeeds);

    if (amount <= 0) return { success: false, message: 'Quantidade inválida para venda.' };
    if (amount > availableToSell) {
      return {
        success: false,
        message: `Estoque disponível insuficiente. Você tem ${item.amount} ${cropDef.unitName}, mas ${item.reservedSeeds} estão estritamente reservadas para sementes de replantio!`,
      };
    }

    const revenue = amount * cropDef.currentPrice;

    setState((prev) => {
      const updatedInv = {
        ...prev.inventory,
        [cropType]: {
          ...item,
          amount: item.amount - amount,
        },
      };

      return {
        ...prev,
        cashAvailable: Number((prev.cashAvailable + revenue).toFixed(2)),
        inventory: updatedInv,
        totalGrainSoldValue: prev.totalGrainSoldValue + revenue,
        transactionHistory: [
          createTx({
            id: `tx_${Date.now()}`,
            day: prev.day,
            type: 'receita_agricola',
            category: 'fazenda',
            description: `Venda de ${amount} ${cropDef.unitName} de ${cropDef.name} a R$ ${cropDef.currentPrice.toFixed(2)}/un`,
            amount: revenue,
            netImpact: revenue,
          }),
          ...prev.transactionHistory,
        ].slice(0, 100),
      };
    });

    return {
      success: true,
      message: `Venda realizada! R$ ${revenue.toFixed(2)} creditados no seu saldo disponível.`,
      revenue,
    };
  }, [state]);

  const setCropReservedSeeds = useCallback((cropType: CropType, amount: number) => {
    const item = state.inventory[cropType];
    const cropDef = state.cropMarket[cropType];

    if (amount < 0 || amount > item.amount) {
      return { success: false, message: `Quantidade reservada deve estar entre 0 e seu estoque atual (${item.amount} ${cropDef.unitName}).` };
    }

    setState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [cropType]: {
          ...item,
          reservedSeeds: amount,
        },
      },
    }));

    return { success: true, message: `Reserva para replantio ajustada para ${amount} ${cropDef.unitName}.` };
  }, [state]);

  const autoReserveSeeds = useCallback((cropType: CropType) => {
    const item = state.inventory[cropType];
    const cropDef = state.cropMarket[cropType];
    // Conta quantos canteiros da fazenda poderiam ser cultivados com essa cultura
    const recommended = cropDef.seedsPerCycle * 2; // Recomendado para 2 canteiros de replantio

    if (item.amount < recommended) {
      return { success: false, message: `Estoque insuficiente para reservar o recomendado (${recommended} ${cropDef.unitName}). Você possui ${item.amount}.` };
    }

    setState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [cropType]: {
          ...item,
          reservedSeeds: recommended,
        },
      },
    }));

    return { success: true, message: `Reservadas ${recommended} ${cropDef.unitName} de ${cropDef.name} para o próximo plantio!` };
  }, [state]);

  // --- FINANÇAS: RESERVA DE EMERGÊNCIA ---

  const depositEmergencyReserve = useCallback((amount: number) => {
    if (amount <= 0) return { success: false, message: 'Valor deve ser positivo.' };
    if (state.cashAvailable < amount) return { success: false, message: 'Saldo disponível insuficiente.' };

    setState((prev) => ({
      ...prev,
      cashAvailable: Number((prev.cashAvailable - amount).toFixed(2)),
      emergencyReserve: Number((prev.emergencyReserve + amount).toFixed(2)),
      transactionHistory: [
        createTx({
          id: `tx_${Date.now()}`,
          day: prev.day,
          type: 'reserva_deposito',
          category: 'reserva',
          description: 'Aporte na Reserva de Emergência',
          amount,
          netImpact: -amount,
          details: 'Recursos separados da conta operacional para proteção contra choques e imprevistos.',
        }),
        ...prev.transactionHistory,
      ].slice(0, 100),
    }));

    return { success: true, message: `R$ ${amount.toFixed(2)} guardados na sua Reserva de Emergência!` };
  }, [state]);

  const withdrawEmergencyReserve = useCallback((amount: number) => {
    if (amount <= 0) return { success: false, message: 'Valor deve ser positivo.' };
    if (state.emergencyReserve < amount) return { success: false, message: 'Saldo da reserva de emergência insuficiente.' };

    setState((prev) => ({
      ...prev,
      cashAvailable: Number((prev.cashAvailable + amount).toFixed(2)),
      emergencyReserve: Number((prev.emergencyReserve - amount).toFixed(2)),
      transactionHistory: [
        createTx({
          id: `tx_${Date.now()}`,
          day: prev.day,
          type: 'reserva_retirada',
          category: 'reserva',
          description: 'Resgate da Reserva de Emergência',
          amount,
          netImpact: amount,
          details: 'Uso consciente da reserva para cobrir necessidades imediatas da fazenda.',
        }),
        ...prev.transactionHistory,
      ].slice(0, 100),
    }));

    return { success: true, message: `R$ ${amount.toFixed(2)} resgatados da reserva para o caixa disponível.` };
  }, [state]);

  // --- MERCADO FINANCEIRO: INVESTIMENTOS ---

  const buyInvestment = useCallback((productId: string, amount: number) => {
    const product = state.investmentsCatalog.find((p) => p.id === productId);
    if (!product) return { success: false, message: 'Produto não encontrado.' };

    if (amount < product.minInvestment) {
      return { success: false, message: `Aporte mínimo para ${product.name} é de R$ ${product.minInvestment.toFixed(2)}.` };
    }

    if (state.cashAvailable < amount) {
      return { success: false, message: `Saldo disponível insuficiente (R$ ${state.cashAvailable.toFixed(2)}).` };
    }

    const quantity = amount / product.currentUnitPrice;

    setState((prev) => {
      const existingPosIndex = prev.userPositions.findIndex((p) => p.productId === productId);
      let updatedPositions: UserPosition[];

      if (existingPosIndex >= 0) {
        const existing = prev.userPositions[existingPosIndex];
        const newTotalAmount = existing.amountInvested + amount;
        const newTotalQty = existing.quantity + quantity;
        const newAvgPrice = newTotalAmount / newTotalQty;

        const updated: UserPosition = {
          ...existing,
          amountInvested: Number(newTotalAmount.toFixed(2)),
          quantity: Number(newTotalQty.toFixed(4)),
          purchaseUnitPrice: Number(newAvgPrice.toFixed(4)),
          currentValue: Number((existing.currentValue + amount).toFixed(2)),
          estimatedNetValue: Number((existing.estimatedNetValue + amount).toFixed(2)),
        };

        updatedPositions = [...prev.userPositions];
        updatedPositions[existingPosIndex] = updated;
      } else {
        const newPosition: UserPosition = {
          id: `pos_${Date.now()}`,
          productId,
          amountInvested: Number(amount.toFixed(2)),
          quantity: Number(quantity.toFixed(4)),
          purchaseUnitPrice: product.currentUnitPrice,
          purchaseDay: prev.day,
          currentValue: Number(amount.toFixed(2)),
          accumulatedGrossEarnings: 0,
          accumulatedDividends: 0,
          estimatedNetValue: Number(amount.toFixed(2)),
        };
        updatedPositions = [...prev.userPositions, newPosition];
      }

      return {
        ...prev,
        cashAvailable: Number((prev.cashAvailable - amount).toFixed(2)),
        userPositions: updatedPositions,
        transactionHistory: [
          createTx({
            id: `tx_${Date.now()}`,
            day: prev.day,
            type: 'aporte_investimento',
            category: 'investimento',
            description: `Aplicação em ${product.name} (${product.code})`,
            amount,
            netImpact: -amount,
            assetName: product.name,
            details: `Compradas ${quantity.toFixed(4)} cotas/títulos a R$ ${product.currentUnitPrice.toFixed(2)}.`,
          }),
          ...prev.transactionHistory,
        ].slice(0, 100),
      };
    });

    return {
      success: true,
      message: `Investimento de R$ ${amount.toFixed(2)} realizado com sucesso em ${product.name}!`,
    };
  }, [state]);

  const sellInvestment = useCallback((positionId: string, quantityToSell?: number) => {
    const position = state.userPositions.find((p) => p.id === positionId);
    if (!position) return { success: false, message: 'Posição não encontrada na custódia.' };

    const product = state.investmentsCatalog.find((p) => p.id === position.productId);
    if (!product) return { success: false, message: 'Ativo correspondente não encontrado.' };

    if (product.liquidity === 'no_vencimento') {
      const daysHeld = state.day - position.purchaseDay;
      if (daysHeld < product.termDays) {
        return {
          success: false,
          message: `${product.name} possui carência e liquidez apenas no vencimento (${product.termDays} dias). Decorridos apenas ${daysHeld} dias.`,
        };
      }
    }

    const qty = quantityToSell ?? position.quantity;
    if (qty <= 0 || qty > position.quantity) {
      return { success: false, message: 'Quantidade para resgate inválida.' };
    }

    // Proporção de resgate
    const ratio = qty / position.quantity;
    const partialAmountInvested = position.amountInvested * ratio;
    const partialGrossValue = position.currentValue * ratio;

    const subPosition: UserPosition = {
      ...position,
      amountInvested: partialAmountInvested,
      currentValue: partialGrossValue,
    };

    const breakdown = calculateLiquidationBreakdown(subPosition, product, state.day);

    setState((prev) => {
      let updatedPositions: UserPosition[];

      if (qty >= position.quantity - 0.0001) {
        // Resgate total da posição
        updatedPositions = prev.userPositions.filter((p) => p.id !== positionId);
      } else {
        // Resgate parcial
        updatedPositions = prev.userPositions.map((p) => {
          if (p.id === positionId) {
            return {
              ...p,
              quantity: Number((p.quantity - qty).toFixed(4)),
              amountInvested: Number((p.amountInvested - partialAmountInvested).toFixed(2)),
              currentValue: Number((p.currentValue - partialGrossValue).toFixed(2)),
            };
          }
          return p;
        });
      }

      return {
        ...prev,
        cashAvailable: Number((prev.cashAvailable + breakdown.netValue).toFixed(2)),
        userPositions: updatedPositions,
        totalTaxesPaid: Number((prev.totalTaxesPaid + breakdown.totalTax).toFixed(2)),
        transactionHistory: [
          createTx({
            id: `tx_${Date.now()}`,
            day: prev.day,
            type: 'resgate_investimento',
            category: 'investimento',
            description: `Resgate de ${product.name}`,
            amount: breakdown.netValue,
            netImpact: breakdown.netValue,
            assetName: product.name,
            details: `Valor Bruto: R$ ${breakdown.grossValue.toFixed(2)} | Impostos Retidos (IR/IOF): R$ ${breakdown.totalTax.toFixed(2)} | Valor Líquido: R$ ${breakdown.netValue.toFixed(2)}. ${breakdown.explanation}`,
          }),
          ...prev.transactionHistory,
        ].slice(0, 100),
      };
    });

    return {
      success: true,
      message: `Resgate liquidado! R$ ${breakdown.netValue.toFixed(2)} creditados no seu saldo disponível (Impostos retidos: R$ ${breakdown.totalTax.toFixed(2)}).`,
    };
  }, [state]);

  // --- AVANÇO DO CALENDÁRIO & MOTOR DIÁRIO ---

  const advanceDay = useCallback(() => {
    // Regra anti-avanço cego: certificar que não está tudo vazio sem ação
    const hasAnyCrops = state.plots.some((p) => p.crop !== null);
    const hasAnyMoneyOrInvestment = state.cashAvailable > 0 || state.userPositions.length > 0;

    if (!hasAnyCrops && !hasAnyMoneyOrInvestment) {
      return { success: false, message: 'A fazenda não pode avançar sem recursos ou plantações ativas.' };
    }

    const previousNetWorth = calculateNetWorth(state).netWorth;
    const currentDay = state.day + 1;

    // 1. Sortear evento se probabilidade disparar
    const shouldSpawnEvent = Math.random() < 0.35 && currentDay > 1;
    let selectedEvent: GameEvent | null = null;
    if (shouldSpawnEvent) {
      const idx = Math.floor(Math.random() * RANDOM_EVENTS.length);
      selectedEvent = RANDOM_EVENTS[idx];
    }

    const eventsMultiplierMap = new Map<string, number>();
    const cropMultipliersMap = new Map<CropType, number>();

    if (selectedEvent) {
      if (selectedEvent.affectedInvestments && selectedEvent.investmentMultiplier) {
        selectedEvent.affectedInvestments.forEach((invId) => {
          eventsMultiplierMap.set(invId, selectedEvent!.investmentMultiplier!);
        });
      }
      if (selectedEvent.affectedCrops && selectedEvent.cropPriceMultiplier) {
        selectedEvent.affectedCrops.forEach((c) => {
          cropMultipliersMap.set(c, selectedEvent!.cropPriceMultiplier!);
        });
      }
    }

    // 2. Step Agrícola
    const isRainingToday = selectedEvent?.id === 'chuva_abencoada';
    const { updatedPlots, newMaturePlots, newPestInfestations, dailyMaintenanceCost } = advancePlotsDay(
      state.plots,
      state.cropMarket,
      isRainingToday
    );

    const updatedCropMarket = simulateCropMarketDailyPrices(state.cropMarket, cropMultipliersMap);

    // 3. Atualizar Indicadores Macroeconômicos
    const newMacro = { ...state.macro };
    if (selectedEvent?.selicChange) {
      newMacro.selicRate = Math.max(0.05, newMacro.selicRate + selectedEvent.selicChange);
      newMacro.cdiRate = Math.max(0.048, newMacro.selicRate - 0.001);
    }

    // 4. Step Financeiro
    const {
      updatedCatalog,
      updatedPositions,
      totalGrossYieldToday,
      totalDividendsEarnedToday,
    } = simulateMarketDailyStep(
      state.investmentsCatalog,
      state.userPositions,
      newMacro,
      currentDay,
      eventsMultiplierMap
    );

    // 5. Atualizar caixa disponível com custos e dividendos
    const cashWithCosts = Math.max(0, state.cashAvailable - dailyMaintenanceCost + totalDividendsEarnedToday);

    // 6. Calcular novo Patrimônio Líquido
    const tempStateForNW = {
      cashAvailable: cashWithCosts,
      emergencyReserve: state.emergencyReserve,
      userPositions: updatedPositions,
      farmLandValue: state.farmLandValue,
      toolsEquipmentValue: state.toolsEquipmentValue,
      debts: state.debts,
    };
    const newNetWorth = calculateNetWorth(tempStateForNW).netWorth;
    const netWorthChange = newNetWorth - previousNetWorth;

    // 7. Gerar Relatório Educativo Diário
    let educationalTitle = 'A Importância da Disciplina e do Longo Prazo';
    let educationalExplanation = 'Investir com regularidade e cuidar da fazenda gera o efeito bola de neve: cada real poupado trabalha a seu favor noite e dia.';
    let educationalSource = 'Banco Central do Brasil / CVM';
    let whyItHappened = 'O patrimônio oscilou devido à combinação de custos agrícolas da fazenda, variação dos preços de mercado e rendimentos dos seus ativos.';

    if (totalDividendsEarnedToday > 0) {
      educationalTitle = 'O Poder da Renda Passiva';
      educationalExplanation = 'Dividendos e proventos de Fundos Imobiliários e Ações entram no seu caixa sem você precisar vender o patrimônio principal. Reinvesti-los acelera sua independência financeira!';
      educationalSource = 'B3 — Brasil, Bolsa, Balcão';
      whyItHappened = `Você recebeu R$ ${totalDividendsEarnedToday.toFixed(2)} em proventos que foram diretamente creditados na sua conta corrente.`;
    } else if (selectedEvent?.id === 'copom_alta_selic') {
      educationalTitle = 'Como a Taxa Selic Afeta Seu Bolso';
      educationalExplanation = 'A Selic é a taxa mãe da economia brasileira. Quando sobe, aplicações como Tesouro Selic e CDB rendem mais, enquanto empréstimos ficam mais caros e a inflação tende a desacelerar.';
      educationalSource = 'Banco Central (Copom)';
      whyItHappened = 'O Copom alterou a taxa básica de juros, impactando o retorno diário dos títulos pós-fixados.';
    } else if (newMaturePlots > 0) {
      educationalTitle = 'Momento da Colheita e Planejamento';
      educationalExplanation = 'Lembre-se da regra de sustentabilidade agrícola: separe as sementes do próximo ciclo antes de vender tudo. Nunca consuma a semente do seu futuro!';
      educationalSource = 'Educação Financeira Agro';
      whyItHappened = `${newMaturePlots} canteiro(s) amadureceram hoje e estão prontos para colheita no armazém.`;
    }

    const risksToWatch: string[] = [];
    if (state.cashAvailable < 100) {
      risksToWatch.push('Caixa operacional baixo: mantenha liquidez para sementes e manutenção!');
    }
    if (newPestInfestations > 0) {
      risksToWatch.push(`${newPestInfestations} canteiro(s) sofreram ataque de pragas hoje e precisam de tratamento.`);
    }
    if (state.userPositions.some((p) => p.productId.startsWith('cripto') && p.currentValue > 0.4 * newNetWorth)) {
      risksToWatch.push('Concentração excessiva em criptoativos: risco de desvalorização abrupta.');
    }

    const report: DailyReport = {
      day: currentDay,
      farmRevenue: 0,
      farmOperatingCosts: dailyMaintenanceCost,
      farmNetProfit: -dailyMaintenanceCost,
      cropsHarvestedText: newMaturePlots > 0 ? `${newMaturePlots} canteiros maduros` : 'Nenhuma nova colheita madura',
      investmentsGrossGain: totalGrossYieldToday,
      investmentsEstimatedTaxes: 0,
      investmentsNetGain: totalGrossYieldToday,
      dividendsReceived: totalDividendsEarnedToday,
      previousNetWorth,
      currentNetWorth: newNetWorth,
      netWorthChange,
      activeEvents: selectedEvent ? [selectedEvent] : [],
      educationalInsight: {
        title: educationalTitle,
        explanation: educationalExplanation,
        source: educationalSource,
        whyItHappened,
      },
      risksToWatch,
    };

    // Atualiza o estado
    setState((prev) => {
      // Checar missões
      const updatedMissions = checkAllMissions(prev.missions, prev);

      // Checar conquistas
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.unlockedAtDay === null) {
          if (ach.id === 'primeiro_broto' && prev.totalHarvestsCount > 0) {
            return { ...ach, unlockedAtDay: currentDay };
          }
          if (ach.id === 'reserva_iniciada' && (prev.emergencyReserve >= 500)) {
            return { ...ach, unlockedAtDay: currentDay };
          }
          if (ach.id === 'patrimonio_10k' && newNetWorth >= 10000) {
            return { ...ach, unlockedAtDay: currentDay };
          }
          if (ach.id === 'primeiro_dividendo' && prev.totalDividendsEarned > 0) {
            return { ...ach, unlockedAtDay: currentDay };
          }
        }
        return ach;
      });

      return {
        ...prev,
        day: currentDay,
        energy: prev.maxEnergy, // Restaura energia
        cashAvailable: Number(cashWithCosts.toFixed(2)),
        plots: updatedPlots,
        cropMarket: updatedCropMarket,
        investmentsCatalog: updatedCatalog,
        userPositions: updatedPositions,
        macro: newMacro,
        activeEvents: selectedEvent ? [selectedEvent] : [],
        lastDailyReport: report,
        dailyReports: [report, ...prev.dailyReports].slice(0, 30),
        missions: updatedMissions,
        achievements: updatedAchievements,
        totalDividendsEarned: Number((prev.totalDividendsEarned + totalDividendsEarnedToday).toFixed(2)),
      };
    });

    setShowDailyReport(true);
    setTimeout(() => {
      saveNow();
    }, 50);
    return { success: true, message: `Dia ${currentDay} iniciado com sucesso!`, report };
  }, [state, saveNow]);

  const claimMissionReward = useCallback((missionId: string) => {
    const mission = state.missions.find((m) => m.id === missionId);
    if (!mission || !mission.completed) {
      return { success: false, message: 'Missão ainda não concluída ou inexistente.' };
    }

    setState((prev) => {
      const { newXp, newLevel, required } = addPlayerXp(prev.playerXp, prev.playerLevel, mission.rewardXp);

      return {
        ...prev,
        cashAvailable: Number((prev.cashAvailable + mission.rewardCoins).toFixed(2)),
        playerXp: newXp,
        playerLevel: newLevel,
        xpForNextLevel: required,
        missions: prev.missions.filter((m) => m.id !== missionId),
        transactionHistory: [
          createTx({
            id: `tx_${Date.now()}`,
            day: prev.day,
            type: 'recompensa_missao',
            category: 'outros',
            description: `Recompensa da Missão: ${mission.title}`,
            amount: mission.rewardCoins,
            netImpact: mission.rewardCoins,
          }),
          ...prev.transactionHistory,
        ].slice(0, 100),
      };
    });

    confetti({ particleCount: 50, spread: 60 });
    return { success: true, message: `Recompensa de R$ ${mission.rewardCoins.toFixed(2)} e +${mission.rewardXp} XP resgatada!` };
  }, [state, addPlayerXp]);

  const closeDailyReportModal = useCallback(() => {
    setShowDailyReport(false);
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    setState((prev) => ({ ...prev, gameMode: mode }));
  }, []);

  const resetGame = useCallback(() => {
    if (user) {
      clearGameStateFromStorage(user.uid);
      savePlayerGameSave(user.uid, INITIAL_GAME_STATE).catch(console.warn);
      saveGameStateToStorage(INITIAL_GAME_STATE, user.uid);
    } else {
      clearGameStateFromStorage();
    }
    setState(INITIAL_GAME_STATE);
    setShowDailyReport(false);
  }, [user]);

  return (
    <GameContext.Provider
      value={{
        state,
        syncStatus,
        lastSyncedAt,
        isGameLoading,
        saveNow,
        plantPlot,
        waterPlot,
        waterAllPlots,
        fertilizePlot,
        fertilizeAllPlots,
        treatPest,
        harvestPlot,
        harvestAllPlots,
        expandPlots,
        sellCrop,
        setCropReservedSeeds,
        autoReserveSeeds,
        depositEmergencyReserve,
        withdrawEmergencyReserve,
        buyInvestment,
        sellInvestment,
        advanceDay,
        claimMissionReward,
        closeDailyReportModal,
        setGameMode,
        resetGame,
        showDailyReport,
        setShowDailyReport,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  }
  return context;
}
