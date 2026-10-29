import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  DollarSign,
  Landmark,
  Building2,
  Coins,
  Layers,
  CheckCircle2,
  Calendar,
  Percent,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { InvestmentCategory, InvestmentProduct } from '../types/game';

export const FinancialMarketView: React.FC = () => {
  const { state, buyInvestment } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<InvestmentCategory>('tesouro');
  const [investingProduct, setInvestingProduct] = useState<InvestmentProduct | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const categories: { id: InvestmentCategory; label: string; icon: string }[] = [
    { id: 'tesouro', label: 'Tesouro Direto', icon: '🏛️' },
    { id: 'renda_fixa', label: 'CDB, LCI & LCA', icon: '📄' },
    { id: 'acoes', label: 'Ações Brasileiras', icon: '📈' },
    { id: 'fiis', label: 'Fundos Imobiliários & Fiagro', icon: '🏢' },
    { id: 'cripto', label: 'Criptoativos', icon: '₿' },
    { id: 'fundos', label: 'Fundos de Investimento', icon: '💼' },
  ];

  const filteredProducts = state.investmentsCatalog.filter(
    (p) => p.category === selectedCategory
  );

  const handleOpenInvestModal = (prod: InvestmentProduct) => {
    setInvestingProduct(prod);
    setInvestAmount(prod.minInvestment.toString());
  };

  const handleConfirmInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investingProduct) return;
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) return;

    const res = buyInvestment(investingProduct.id, amount);
    setFeedback(res);
    if (res.success) {
      setInvestingProduct(null);
      setInvestAmount('');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const getRiskBadge = (risk: InvestmentProduct['riskLevel']) => {
    switch (risk) {
      case 'baixo':
        return <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Baixo Risco</span>;
      case 'medio':
        return <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">Médio Risco</span>;
      case 'alto':
        return <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">Alto Risco</span>;
      case 'muito_alto':
        return <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">Risco Extremo</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback de Compra */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 ${
            feedback.success
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : 'bg-red-950/90 border-red-500 text-red-200'
          }`}
        >
          {feedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Cabeçalho do Mercado Financeiro */}
      <div className="bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Mercado Financeiro Brasileiro</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulação realista com títulos do Tesouro Nacional, Renda Fixa privada com FGC, Ações da B3, Fundos Imobiliários e Criptoativos.
          </p>
        </div>

        {/* Saldo Disponível para Investir */}
        <div className="bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Saldo Livre para Aporte
            </span>
            <span className="text-white font-black text-sm sm:text-base font-mono">
              R$ {state.cashAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Menu de Categorias */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid de Ativos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => {
          const userHasPos = state.userPositions.some((p) => p.productId === prod.id);

          return (
            <div
              key={prod.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md flex flex-col justify-between transition-all"
            >
              <div>
                {/* Topo do Ativo */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{prod.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-bold">
                        {prod.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {prod.issuer}
                    </span>
                  </div>
                  {getRiskBadge(prod.riskLevel)}
                </div>

                <p className="text-xs text-slate-300 mb-3 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>

                {/* Detalhes de Rentabilidade e Regras */}
                <div className="bg-slate-950/80 rounded-xl p-3 text-xs space-y-1.5 mb-3 border border-slate-800/80 font-mono">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 text-[11px]">Remuneração:</span>
                    <span className="font-bold text-emerald-300">{prod.nominalRateText}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 text-[11px]">Preço Unitário:</span>
                    <span className="font-bold text-white">R$ {prod.currentUnitPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 text-[11px]">Liquidez:</span>
                    <span className="text-slate-200">{prod.liquidity}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 text-[11px]">Tributação IR:</span>
                    <span className={prod.isTaxExempt ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {prod.isTaxExempt ? 'Isento de IR (0%)' : 'Tabela Regressiva'}
                    </span>
                  </div>

                  {prod.hasFGC && (
                    <div className="flex items-center gap-1 text-[10px] text-teal-300 pt-1 border-t border-slate-800 font-sans">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Protegido pelo FGC até R$ 250 mil</span>
                    </div>
                  )}

                  {prod.hasMarkToMarket && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-300 pt-1 border-t border-slate-800 font-sans">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Sofre Marcação a Mercado se resgatar antes</span>
                    </div>
                  )}

                  {prod.dividendYieldMonthly && (
                    <div className="flex items-center gap-1 text-[10px] text-purple-300 pt-1 border-t border-slate-800 font-sans">
                      <Percent className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Distribui proventos periódicos isentos</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Investir */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400">
                  Mínimo: <span className="text-white font-mono font-bold">R$ {prod.minInvestment.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => handleOpenInvestModal(prod)}
                  disabled={state.cashAvailable < prod.minInvestment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {userHasPos ? 'Aportar Mais' : 'Investir'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Simulação e Confirmação de Aporte */}
      {investingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                  <span>Aplicar em {investingProduct.name}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {investingProduct.code} • {investingProduct.nominalRateText}
                </span>
              </div>
              <button
                onClick={() => setInvestingProduct(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmInvestment} className="space-y-4">
              {/* Informações Educativas do Ativo */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {investingProduct.category === 'tesouro' && (
                      investingProduct.id === 'tesouro_selic_2029'
                        ? 'O Tesouro Selic remunera diariamente com base na taxa básica de juros do Banco Central. Ideal para a sua Reserva de Emergência!'
                        : 'Atenção à Marcação a Mercado: se você resgatar este título antes do prazo final, o preço varia conforme as expectativas de juros do mercado.'
                    )}
                    {investingProduct.category === 'renda_fixa' && (
                      investingProduct.isTaxExempt
                        ? 'LCA/LCI: São isentas de Imposto de Renda para pessoas físicas. Compare sempre o retorno líquido!'
                        : 'CDB: Possui proteção do Fundo Garantidor de Créditos (FGC) até R$ 250.000 e tributação regressiva de IR.'
                    )}
                    {investingProduct.category === 'acoes' && 'Ações representam frações do capital de empresas brasileiras. Podem valorizar e pagar dividendos, mas também podem oscilar e apresentar prejuízos.'}
                    {investingProduct.category === 'fiis' && 'Fundos Imobiliários e Fiagro geram renda passiva periódica isenta de IR na sua conta, além da oscilação das cotas na B3.'}
                    {investingProduct.category === 'cripto' && 'Atenção: Criptoativos possuem volatilidade extrema e não possuem garantia do governo nem do FGC. Nunca aplique sua reserva de emergência aqui.'}
                    {investingProduct.category === 'fundos' && 'Fundos contam com gestão profissional, cobrança de taxa de administração e come-cotas semestral.'}
                  </p>
                </div>
              </div>

              {/* Input de Valor */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Valor a Investir em Moedas Fictícias (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">R$</span>
                  <input
                    type="number"
                    min={investingProduct.minInvestment}
                    max={state.cashAvailable}
                    step="1"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Mínimo: R$ {investingProduct.minInvestment.toFixed(2)}</span>
                  <span>Disponível: R$ {state.cashAvailable.toFixed(2)}</span>
                </div>
              </div>

              {/* Botões Rápidos de Valor */}
              <div className="flex gap-2">
                {[100, 250, 500, 1000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setInvestAmount(Math.min(v, state.cashAvailable).toString())}
                    disabled={v > state.cashAvailable}
                    className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs font-mono text-slate-300"
                  >
                    R$ {v}
                  </button>
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setInvestingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    parseFloat(investAmount) < investingProduct.minInvestment ||
                    parseFloat(investAmount) > state.cashAvailable
                  }
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  Confirmar Aplicação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
