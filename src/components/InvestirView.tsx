import React, { useState } from 'react';
import { FinancialMarketView } from './FinancialMarketView';
import { PortfolioView } from './PortfolioView';
import { TrendingUp, Wallet, Layers } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const InvestirView: React.FC = () => {
  const { state } = useGame();
  const [subTab, setSubTab] = useState<'mercado' | 'carteira'>('mercado');

  const positionsCount = state.userPositions.length;
  const totalInvestedGross = state.userPositions.reduce((acc, p) => acc + p.currentValue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-navegação interna entre Mercado e Carteira */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-md">
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setSubTab('mercado')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'mercado'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950 border border-purple-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Mercado Financeiro</span>
          </button>

          <button
            onClick={() => setSubTab('carteira')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'carteira'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950 border border-purple-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Minha Carteira</span>
            {positionsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-900 text-purple-200 font-mono">
                {positionsCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 px-2 text-xs text-slate-400">
          <span>Aplicado no Mercado:</span>
          <span className="font-extrabold text-purple-300 font-mono text-sm">
            R$ {totalInvestedGross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Renderiza a visão selecionada */}
      {subTab === 'mercado' ? <FinancialMarketView /> : <PortfolioView />}
    </div>
  );
};
