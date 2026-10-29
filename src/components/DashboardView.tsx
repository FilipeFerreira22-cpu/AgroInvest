import React, { useState } from 'react';
import {
  Wallet,
  Shield,
  Coins,
  TrendingUp,
  Landmark,
  Sprout,
  Package,
  Target,
  Bot,
  ArrowRight,
  Sparkles,
  Percent,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PieChart,
  BarChart3,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { calculateNetWorth } from '../utils/financeEngine';
import { TabType } from '../App';

interface DashboardViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenAgroGuia: () => void;
  onOpenReserveModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenAgroGuia,
  onOpenReserveModal,
}) => {
  const { state } = useGame();
  const { netWorth } = calculateNetWorth(state);

  const totalInvestedGross = state.userPositions.reduce((acc, p) => acc + p.currentValue, 0);
  const farmAssetsValue = state.farmLandValue + state.toolsEquipmentValue;
  const readyToHarvestPlots = state.plots.filter((p) => p.stage === 'maduro').length;
  const growingPlots = state.plots.filter((p) => p.stage === 'crescendo').length;
  const totalHarvestedItemsInStock = Object.values(state.inventory).reduce(
    (acc, item) => acc + item.amount,
    0
  );

  // Cálculo percentual da alocação de ativos
  const safeNetWorth = netWorth > 0 ? netWorth : 1;
  const cashPct = Math.round((state.cashAvailable / safeNetWorth) * 100);
  const reservePct = Math.round((state.emergencyReserve / safeNetWorth) * 100);
  const investPct = Math.round((totalInvestedGross / safeNetWorth) * 100);
  const farmPct = Math.round((farmAssetsValue / safeNetWorth) * 100);

  // Missões ativas incompletas
  const pendingMissions = state.missions.filter((m) => m.isUnlocked && !m.completed).slice(0, 3);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Banner de Boas-Vindas & Status Executivo */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-700/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Painel do Produtor • Dia #{state.day}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400" />
                <span>Energia: {state.energy}/{state.maxEnergy}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-display mt-1.5 sm:mt-2">
              Visão Geral do Patrimônio
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-300 mt-0.5 sm:mt-1 max-w-2xl">
              Acompanhe sua liquidez, solidez da reserva de emergência, rendimento dos investimentos e a produção da fazenda em um só lugar.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => onNavigateTab('fazenda')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950 transition cursor-pointer min-h-[36px]"
            >
              <Sprout className="w-4 h-4" />
              <span>Gerenciar Fazenda</span>
            </button>
            <button
              onClick={() => onNavigateTab('investir')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[36px]"
            >
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Investimentos</span>
            </button>
          </div>
        </div>

        {/* Card Destaque: Patrimônio Líquido Total */}
        <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-emerald-300 font-bold uppercase tracking-wider">
              <span>Patrimônio Líquido</span>
              <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded-full text-emerald-300">Total</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-white font-display mt-0.5 sm:mt-1 font-mono">
              R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Soma de todos os seus ativos financeiros e rurais</span>
            </p>
          </div>

          {/* Caixa Disponível */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                <span>Caixa Disponível</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{cashPct}% da carteira</span>
            </div>
            <div className="text-xl font-bold text-white font-display mt-1">
              R$ {state.cashAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Liquidez imediata para plantio e insumos</span>
          </div>

          {/* Reserva de Emergência */}
          <div className="bg-slate-900/80 border border-blue-900/50 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Reserva de Emergência</span>
              </span>
              <button
                onClick={onOpenReserveModal}
                className="text-[10px] font-bold text-blue-300 bg-blue-950/80 hover:bg-blue-800/80 px-2 py-0.5 rounded border border-blue-700/60 transition cursor-pointer"
              >
                Ajustar
              </button>
            </div>
            <div className="text-xl font-bold text-white font-display mt-1">
              R$ {state.emergencyReserve.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-blue-300/80 block mt-1">
              Rende 100% do CDI diariamente com segurança
            </span>
          </div>

          {/* Mercado Financeiro */}
          <div className="bg-slate-900/80 border border-purple-900/50 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Mercado Financeiro</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{investPct}% da carteira</span>
            </div>
            <div className="text-xl font-bold text-white font-display mt-1">
              R$ {totalInvestedGross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-purple-300/80 block mt-1">
              {state.userPositions.length} ativos aplicados (Tesouro, CDB, Ações, FIIs)
            </span>
          </div>
        </div>
      </div>

      {/* Grid Central: Alocação de Ativos + Indicadores Macroeconômicos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição da Carteira (Diversificação) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Diversificação de Ativos</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Princípio da CVM</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Evite concentrar todo o seu dinheiro em um único setor para mitigar riscos de mercado e de clima.
          </p>

          <div className="mt-4 space-y-3">
            {/* Barra Caixa */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Caixa Disponível</span>
                </span>
                <span className="font-mono font-bold">{cashPct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${cashPct}%` }} />
              </div>
            </div>

            {/* Barra Reserva */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span>Reserva de Emergência</span>
                </span>
                <span className="font-mono font-bold">{reservePct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${reservePct}%` }} />
              </div>
            </div>

            {/* Barra Investimentos */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span>Mercado Financeiro</span>
                </span>
                <span className="font-mono font-bold">{investPct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${investPct}%` }} />
              </div>
            </div>

            {/* Barra Fazenda */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Terra & Equipamentos</span>
                </span>
                <span className="font-mono font-bold">{farmPct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${farmPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores Econômicos Brasileiros */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Indicadores Macroeconômicos Brasileiros</span>
            </h2>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
              Banco Central & CVM
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {/* Selic */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Taxa Selic Meta</span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                {(state.macro.selicRate * 100).toFixed(2)}% a.a.
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Taxa básica definida pelo Copom</p>
            </div>

            {/* CDI */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Taxa CDI</span>
              <span className="text-base sm:text-lg font-black text-blue-300 font-mono">
                {(state.macro.cdiRate * 100).toFixed(2)}% a.a.
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Referência para CDB e LCI/LCA</p>
            </div>

            {/* IPCA */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Inflação IPCA</span>
              <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                {(state.macro.ipcaAnnual * 100).toFixed(2)}% a.a.
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Índice oficial de preços ao consumidor</p>
            </div>

            {/* Sentimento do Mercado */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sentimento</span>
              <span className="text-xs sm:text-sm font-extrabold capitalize text-emerald-400 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {state.macro.marketSentiment.replace('_', ' ')}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Condição de liquidez e apetite a risco</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>💡 Entenda como a Selic afeta seus investimentos rurais e títulos públicos</span>
            <button
              onClick={onOpenAgroGuia}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Perguntar ao AgroGuia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visão Rápida dos Módulos Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar da Fazenda */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Status da Lavoura</h3>
                <span className="text-[11px] text-slate-400">Canteiros e manejo de produção</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('fazenda')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ir para a Fazenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Canteiros</span>
              <span className="text-lg font-black text-white font-display mt-0.5 block">
                {state.plots.filter((p) => p.crop !== null).length}/{state.plots.length}
              </span>
              <span className="text-[10px] text-slate-400">em cultivo</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Prontos</span>
              <span className="text-lg font-black text-amber-400 font-display mt-0.5 block">
                {readyToHarvestPlots}
              </span>
              <span className="text-[10px] text-slate-400">para colheita</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">No Armazém</span>
              <span className="text-lg font-black text-emerald-400 font-display mt-0.5 block">
                {totalHarvestedItemsInStock}
              </span>
              <span className="text-[10px] text-slate-400">itens estocados</span>
            </div>
          </div>

          {readyToHarvestPlots > 0 && (
            <div className="mt-4 p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl flex items-center justify-between text-xs">
              <span className="text-amber-200 font-medium">
                🌾 Há {readyToHarvestPlots} canteiro(s) maduro(s) pronto(s) para colheita!
              </span>
              <button
                onClick={() => onNavigateTab('fazenda')}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
              >
                Colher
              </button>
            </div>
          )}
        </div>

        {/* Radar das Missões Diárias */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Missões & Metas do Dia</h3>
                <span className="text-[11px] text-slate-400">Aprenda e conquiste recompensas</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('missoes')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {pendingMissions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                🎉 Todas as missões ativas foram concluídas! Avance o dia para novos desafios.
              </div>
            ) : (
              pendingMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-200">{mission.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{mission.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-amber-300 font-mono">+{mission.rewardCoins} R$</span>
                    <span className="text-[10px] text-slate-500 block">+{mission.rewardXp} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Banner AgroGuia Integrado */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base font-display">
              AgroGuia — Inteligência Educativa em Finanças & Agro
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Dúvidas sobre Tesouro Selic, Marcação a Mercado, Diversificação ou Custos de Safra? AgroGuia cita fontes oficiais do Banco Central, CVM e Embrapa.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAgroGuia}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shrink-0 cursor-pointer"
        >
          Conversar Agora
        </button>
      </div>
    </div>
  );
};
