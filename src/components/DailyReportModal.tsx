import React from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Sprout,
  Coins,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const DailyReportModal: React.FC = () => {
  const { state, showDailyReport, closeDailyReportModal } = useGame();

  if (!showDailyReport || !state.lastDailyReport) return null;

  const report = state.lastDailyReport;
  const isNetWorthUp = report.netWorthChange >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        <div className="p-6 space-y-5">
          {/* Topo do Relatório */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-display">
                  Fechamento do Dia #{report.day}
                </h2>
                <p className="text-xs text-slate-400">
                  Balanço das atividades rurais, mercado financeiro e evolução patrimonial.
                </p>
              </div>
            </div>

            <button
              onClick={closeDailyReportModal}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Destaque do Patrimônio Líquido */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold block">
                Patrimônio Líquido Atualizado
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 block">
                R$ {report.currentNetWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono ${
                isNetWorthUp
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {isNetWorthUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isNetWorthUp ? '+' : ''}R$ {report.netWorthChange.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Comparativo de Resultados: Fazenda vs Investimentos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Atividade Agrícola */}
            <div className="bg-slate-950/70 border border-emerald-900/40 rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-sans">
                <Sprout className="w-4 h-4" />
                <span>Operação da Fazenda</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Custos de Manutenção:</span>
                <span className="text-amber-300">-R$ {report.farmOperatingCosts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Status da Lavoura:</span>
                <span className="text-white font-sans">{report.cropsHarvestedText}</span>
              </div>
            </div>

            {/* 2. Mercado Financeiro */}
            <div className="bg-slate-950/70 border border-purple-900/40 rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold font-sans">
                <TrendingUp className="w-4 h-4" />
                <span>Mercado Financeiro</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Rendimento do Dia:</span>
                <span className={report.investmentsGrossGain >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {report.investmentsGrossGain >= 0 ? '+' : ''}R$ {report.investmentsGrossGain.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Dividendos Creditados:</span>
                <span className="text-amber-300">+R$ {report.dividendsReceived.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Seção Exclusiva Exigida: "POR QUE ISSO ACONTECEU?" */}
          <div className="bg-slate-950 border border-blue-800/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider font-display">
              <HelpCircle className="w-4 h-4" />
              <span>Por que isso aconteceu?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {report.educationalInsight.whyItHappened}
            </p>
          </div>

          {/* Dica de Educação Financeira (Fontes Oficiais: CVM / Bacen / Tesouro / B3) */}
          <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider font-display">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>{report.educationalInsight.title}</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Fonte: {report.educationalInsight.source}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.educationalInsight.explanation}
            </p>
          </div>

          {/* Riscos a Observar */}
          {report.risksToWatch.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-2xl p-3.5 space-y-1.5 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Atenção aos Riscos:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {report.risksToWatch.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rodapé com Botão de Prosseguir */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={closeDailyReportModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 cursor-pointer font-display"
          >
            Continuar Atividades Rurais
          </button>
        </div>
      </div>
    </div>
  );
};
