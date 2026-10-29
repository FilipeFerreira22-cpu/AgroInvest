import React, { useState } from 'react';
import { Calculator, TrendingUp, Info, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [initialAmount, setInitialAmount] = useState<number>(500);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(100);
  const [years, setYears] = useState<number>(5);

  if (!isOpen) return null;

  // Taxas anuais estimadas para comparação didática
  const POUPANCA_ANNUAL = 0.065; // ~6.5% a.a.
  const CDI_ANNUAL = 0.1065; // ~10.65% a.a. (100% do CDI)
  const IPCA_PLUS_ANNUAL = 0.115; // ~11.5% a.a. (IPCA + Cupom)

  const months = years * 12;

  const calculateGrowth = (annualRate: number) => {
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    let balance = initialAmount;
    for (let m = 0; m < months; m++) {
      balance = balance * (1 + monthlyRate) + monthlyAmount;
    }
    return balance;
  };

  const totalInvestedByPlayer = initialAmount + monthlyAmount * months;
  const poupancaTotal = calculateGrowth(POUPANCA_ANNUAL);
  const cdiTotal = calculateGrowth(CDI_ANNUAL);
  const ipcaPlusTotal = calculateGrowth(IPCA_PLUS_ANNUAL);

  const maxVal = Math.max(poupancaTotal, cdiTotal, ipcaPlusTotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-display">
                  Simulador de Juros Compostos
                </h3>
                <p className="text-xs text-slate-400">
                  Veja na prática como a taxa certa e a constância aceleram o crescimento patrimonial.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Controles de Simulação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Aporte Inicial (R$)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Aporte Mensal (R$)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Prazo ({years} anos)
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value) || 1)}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>
          </div>

          {/* Gráfico Comparativo em Barras */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Projeção Acumulada em {years} anos ({months} meses):
            </span>

            {/* Total do próprio bolso */}
            <div className="text-xs text-slate-400 font-mono flex justify-between pb-1 border-b border-slate-800/80">
              <span>Total que saiu do seu bolso (Principal):</span>
              <span className="font-bold text-white">
                R$ {totalInvestedByPlayer.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Barra 1: Poupança */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Poupança Tradicional (~6,5% a.a.)</span>
                <span className="font-mono font-bold text-slate-300">
                  R$ {poupancaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-slate-500 h-full rounded-full"
                  style={{ width: `${(poupancaTotal / maxVal) * 100}%` }}
                />
              </div>
            </div>

            {/* Barra 2: CDB 100% CDI */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-semibold">CDB 100% CDI / Tesouro Selic (~10,65% a.a.)</span>
                <span className="font-mono font-bold text-emerald-300">
                  R$ {cdiTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(cdiTotal / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block">
                Ganho adicional sobre a poupança: +R$ {(cdiTotal - poupancaTotal).toFixed(2)}
              </span>
            </div>

            {/* Barra 3: Tesouro IPCA+ */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400 font-semibold">Tesouro IPCA+ Longo Prazo (~11,5% a.a.)</span>
                <span className="font-mono font-bold text-amber-300">
                  R$ {ipcaPlusTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(ipcaPlusTotal / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-amber-400 font-mono block">
                Ganho adicional sobre a poupança: +R$ {(ipcaPlusTotal - poupancaTotal).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              No curto prazo, a diferença entre 6% e 11% ao ano parece sutil. No entanto, com o passar dos anos, os juros sobre juros geram uma curva exponencial. Esse é o segredo dos grandes produtores rurais e investidores patrimoniais!
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Fechar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
