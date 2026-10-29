import React, { useState } from 'react';
import {
  FileText,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Sprout,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TransactionRecord } from '../types/game';

export const HistoryView: React.FC = () => {
  const { state } = useGame();
  const [filter, setFilter] = useState<'tudo' | 'fazenda' | 'investimento' | 'reserva'>('tudo');

  const filtered = state.transactionHistory.filter((tx) => {
    if (filter === 'tudo') return true;
    return tx.category === filter;
  });

  const getIcon = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'receita_agricola':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'custo_agricola':
        return <Sprout className="w-4 h-4 text-amber-400" />;
      case 'aporte_investimento':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'resgate_investimento':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'dividendo':
        return <Coins className="w-4 h-4 text-purple-400" />;
      case 'reserva_deposito':
      case 'reserva_retirada':
        return <Shield className="w-4 h-4 text-teal-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Extrato Financeiro & Histórico de Operações</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro contábil transparente e auditável. Sem dupla contagem entre transferências de caixa e variações patrimoniais.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['tudo', 'fazenda', 'investimento', 'reserva'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Nenhuma transação encontrada nesta categoria.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3 px-3">Dia</th>
                <th className="py-3 px-3">Tipo</th>
                <th className="py-3 px-3">Descrição & Memória</th>
                <th className="py-3 px-3 text-right">Impacto no Caixa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((tx) => {
                const isPositive = tx.netImpact >= 0;

                return (
                  <tr key={tx.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-bold">
                      Dia {tx.day}
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2 text-slate-300">
                        {getIcon(tx.type)}
                        <span className="capitalize font-medium text-xs">
                          {tx.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-white text-xs">{tx.description}</div>
                      {tx.details && (
                        <div className="text-[11px] text-slate-400 mt-0.5 font-normal">
                          {tx.details}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={`font-black text-xs ${
                          isPositive ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}R$ {tx.netImpact.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
