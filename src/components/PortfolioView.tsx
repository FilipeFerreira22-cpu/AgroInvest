import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  AlertCircle,
  Shield,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { UserPosition } from '../types/game';
import { calculateLiquidationBreakdown } from '../utils/financeEngine';

export const PortfolioView: React.FC = () => {
  const { state, sellInvestment } = useGame();
  const [selectedPosForRedemption, setSelectedPosForRedemption] = useState<UserPosition | null>(null);
  const [redemptionFeedback, setRedemptionFeedback] = useState<string | null>(null);

  const totalInvestedPrincipal = state.userPositions.reduce((acc, p) => acc + p.amountInvested, 0);
  const totalCurrentGross = state.userPositions.reduce((acc, p) => acc + p.currentValue, 0);
  const totalGrossEarnings = totalCurrentGross - totalInvestedPrincipal;
  const totalEstimatedNet = state.userPositions.reduce((acc, p) => acc + p.estimatedNetValue, 0);

  const handleConfirmRedeem = () => {
    if (!selectedPosForRedemption) return;
    const res = sellInvestment(selectedPosForRedemption.id);
    setRedemptionFeedback(res.message);
    setSelectedPosForRedemption(null);
    setTimeout(() => setRedemptionFeedback(null), 4000);
  };

  const selectedProduct = selectedPosForRedemption
    ? state.investmentsCatalog.find((p) => p.id === selectedPosForRedemption.productId)
    : null;

  const redemptionBreakdown =
    selectedPosForRedemption && selectedProduct
      ? calculateLiquidationBreakdown(selectedPosForRedemption, selectedProduct, state.day)
      : null;

  return (
    <div className="space-y-6">
      {/* Feedback de Resgate */}
      {redemptionFeedback && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{redemptionFeedback}</span>
        </div>
      )}

      {/* Resumo da Carteira */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">
            Total Aplicado (Principal)
          </span>
          <span className="text-lg sm:text-xl font-black text-white font-mono mt-1 block">
            R$ {totalInvestedPrincipal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Capital original direcionado aos investimentos
          </span>
        </div>

        <div className="bg-slate-900/90 border border-purple-900/40 rounded-2xl p-4 shadow-md">
          <span className="text-[11px] text-purple-300 font-semibold block uppercase">
            Valor Bruto em Custódia
          </span>
          <span className="text-lg sm:text-xl font-black text-purple-200 font-mono mt-1 block">
            R$ {totalCurrentGross.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1 text-[11px] mt-1 font-bold">
            {totalGrossEarnings >= 0 ? (
              <span className="text-emerald-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +R$ {totalGrossEarnings.toFixed(2)} (Lucro Bruto)
              </span>
            ) : (
              <span className="text-red-400 flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -R$ {Math.abs(totalGrossEarnings).toFixed(2)} (Perda Bruta)
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-4 shadow-md">
          <span className="text-[11px] text-emerald-300 font-semibold block uppercase">
            Valor Líquido Projetado
          </span>
          <span className="text-lg sm:text-xl font-black text-emerald-200 font-mono mt-1 block">
            R$ {totalEstimatedNet.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Após desconto simulado de IR e IOF na fonte
          </span>
        </div>

        <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-4 shadow-md">
          <span className="text-[11px] text-amber-300 font-semibold block uppercase">
            Proventos Recebidos
          </span>
          <span className="text-lg sm:text-xl font-black text-amber-200 font-mono mt-1 block">
            R$ {state.totalDividendsEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Renda passiva creditada diretamente no caixa
          </span>
        </div>
      </div>

      {/* Lista de Posições Detalhada */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>Posições Ativas em Custódia</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {state.userPositions.length} ativos
            </span>
          </h3>
        </div>

        {state.userPositions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <p className="text-sm text-slate-400">
              Você ainda não possui investimentos ativos.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Acesse a aba <strong>Mercado Financeiro</strong> para aplicar em Tesouro Direto, CDBs ou Ações.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3 px-3">Ativo</th>
                  <th className="py-3 px-3">Quantidade</th>
                  <th className="py-3 px-3">Aplicado</th>
                  <th className="py-3 px-3">Valor Bruto</th>
                  <th className="py-3 px-3">Resultado</th>
                  <th className="py-3 px-3">Dias em Carteira</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {state.userPositions.map((pos) => {
                  const prod = state.investmentsCatalog.find((p) => p.id === pos.productId);
                  if (!prod) return null;

                  const daysHeld = state.day - pos.purchaseDay;
                  const profit = pos.currentValue - pos.amountInvested;
                  const profitPercent = (profit / pos.amountInvested) * 100;

                  return (
                    <tr key={pos.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-3 font-sans">
                        <div className="font-bold text-white text-xs">{prod.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{prod.code} • {prod.category}</span>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {pos.quantity.toFixed(4)}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        R$ {pos.amountInvested.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 font-bold text-white">
                        R$ {pos.currentValue.toFixed(2)}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`font-bold ${
                            profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {profit >= 0 ? '+' : ''}R$ {profit.toFixed(2)} ({profitPercent.toFixed(1)}%)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {daysHeld} dias
                        {prod.hasIOF && daysHeld < 30 && (
                          <span className="block text-[9px] text-amber-400 font-sans">
                            ⚠️ Sujeito a IOF
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedPosForRedemption(pos)}
                          className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 font-sans font-bold text-xs transition-colors cursor-pointer"
                        >
                          Resgatar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Transparente de Resgate com Memória de Cálculo Fiscal (IR/IOF) */}
      {selectedPosForRedemption && selectedProduct && redemptionBreakdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-blue-400" />
                  <span>Simulador de Resgate & Tributação</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedProduct.name} ({selectedProduct.code})
                </span>
              </div>
              <button
                onClick={() => setSelectedPosForRedemption(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Memória de Cálculo Financeiro */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Valor Original Aplicado:</span>
                  <span>R$ {selectedPosForRedemption.amountInvested.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white font-bold">
                  <span>Valor Bruto Acumulado:</span>
                  <span>R$ {redemptionBreakdown.grossValue.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-emerald-400">
                  <span>Rendimento Bruto (Lucro):</span>
                  <span>+R$ {redemptionBreakdown.grossProfit.toFixed(2)}</span>
                </div>

                {redemptionBreakdown.iofAmount > 0 && (
                  <div className="flex justify-between text-amber-400 pt-1 border-t border-slate-800">
                    <span>(-) IOF Retido (&lt; 30 dias):</span>
                    <span>-R$ {redemptionBreakdown.iofAmount.toFixed(2)}</span>
                  </div>
                )}

                {redemptionBreakdown.irAmount > 0 && (
                  <div className="flex justify-between text-red-400 pt-1 border-t border-slate-800">
                    <span>(-) Imposto de Renda Retido:</span>
                    <span>-R$ {redemptionBreakdown.irAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-700 text-sm font-bold font-display">
                  <span className="text-emerald-300">(=) Valor Líquido a Receber:</span>
                  <span className="text-emerald-300">R$ {redemptionBreakdown.netValue.toFixed(2)}</span>
                </div>
              </div>

              {/* Explicação Didática da Regra Fiscal */}
              <div className="bg-blue-950/40 border border-blue-800/40 p-3.5 rounded-xl text-xs text-blue-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">
                  {redemptionBreakdown.explanation}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setSelectedPosForRedemption(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Manter Investido
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
                >
                  Confirmar Resgate Líquido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
