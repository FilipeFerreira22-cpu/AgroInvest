import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CropType } from '../types/game';

export const WarehouseView: React.FC = () => {
  const { state, sellCrop, setCropReservedSeeds, autoReserveSeeds } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSell = (cropType: CropType, amount: number) => {
    const res = sellCrop(cropType, amount);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleAutoReserve = (cropType: CropType) => {
    const res = autoReserveSeeds(cropType);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Notificação */}
      {feedback && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Cabeçalho do Armazém */}
      <div className="bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Armazém Geral & Mercado Agrícola</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Controle os estoques colhidos, gerencie a reserva técnica de sementes e comercialize o excedente nas melhores cotações.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Comercializado</span>
            <span className="font-extrabold text-emerald-300 text-sm sm:text-base font-mono">
              R$ {state.totalGrainSoldValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Colheitas Efetuadas</span>
            <span className="font-extrabold text-amber-300 text-sm sm:text-base font-mono">
              {state.totalHarvestsCount} safras
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Itens no Armazém */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(state.cropMarket) as CropType[]).map((cropKey) => {
          const crop = state.cropMarket[cropKey];
          const inv = state.inventory[cropKey];
          const availableToSell = Math.max(0, inv.amount - inv.reservedSeeds);
          const priceDiff = crop.currentPrice - crop.basePrice;
          const isPriceUp = priceDiff >= 0;

          return (
            <div
              key={crop.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Topo do Card */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-sm">{crop.name}</h3>
                      <span className="text-[11px] text-slate-400">
                        {inv.amount} {crop.unitName} em estoque
                      </span>
                    </div>
                  </div>

                  {/* Cotação do Dia */}
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-emerald-300">
                      R$ {crop.currentPrice.toFixed(2)}
                    </div>
                    <div
                      className={`flex items-center justify-end text-[10px] font-bold ${
                        isPriceUp ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isPriceUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      <span>{((priceDiff / crop.basePrice) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Painel de Reserva vs Venda */}
                <div className="bg-slate-950/80 rounded-xl p-3 space-y-2 mb-3 border border-slate-800/80 text-xs">
                  {/* Sementes Reservadas */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                      <span>Reserva p/ Replantio:</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-blue-300">
                      <span>{inv.reservedSeeds} {crop.unitName}</span>
                    </div>
                  </div>

                  {/* Excedente Livre para Comercializar */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Excedente p/ Venda:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      {availableToSell} {crop.unitName}
                    </span>
                  </div>

                  {/* Valor Potencial do Excedente */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Receita Potencial:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      R$ {(availableToSell * crop.currentPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {/* Botão de Ajuste de Reserva Técnica */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAutoReserve(crop.id)}
                    disabled={inv.amount < crop.seedsPerCycle}
                    className="flex-1 py-1.5 px-2 bg-blue-950/70 hover:bg-blue-900 border border-blue-700/60 rounded-xl text-[11px] font-bold text-blue-200 transition-colors disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Auto-Reservar Sementes</span>
                  </button>

                  {inv.reservedSeeds > 0 && (
                    <button
                      onClick={() => setCropReservedSeeds(crop.id, 0)}
                      className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer"
                      title="Liberar reserva para venda"
                    >
                      Liberar
                    </button>
                  )}
                </div>

                {/* Botões de Venda */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleSell(crop.id, Math.ceil(availableToSell * 0.25))}
                    disabled={availableToSell <= 0}
                    className="py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/50 rounded-xl text-[11px] font-bold text-emerald-300 disabled:opacity-30 cursor-pointer"
                  >
                    Vender 25%
                  </button>
                  <button
                    onClick={() => handleSell(crop.id, Math.ceil(availableToSell * 0.50))}
                    disabled={availableToSell <= 0}
                    className="py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/50 rounded-xl text-[11px] font-bold text-emerald-300 disabled:opacity-30 cursor-pointer"
                  >
                    Vender 50%
                  </button>
                  <button
                    onClick={() => handleSell(crop.id, availableToSell)}
                    disabled={availableToSell <= 0}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[11px] font-bold text-white shadow-md shadow-emerald-950 disabled:opacity-30 cursor-pointer"
                  >
                    Vender Tudo
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cartão Educativo: Ciclos de Preço e Commodities */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 flex items-start gap-4">
        <ArrowRightLeft className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="font-bold text-white text-sm font-display">
            Entendendo a Dinâmica de Preços Agrícolas no Brasil
          </h4>
          <p className="leading-relaxed">
            No mercado real, grãos como <strong>soja e milho</strong> são commodities globais precificadas em dólares na Bolsa de Chicago (CBOT) e influenciadas pela safra norte-americana e sul-americana. Já <strong>hortaliças e feijão</strong> sofrem forte influência de eventos climáticos locais (como geadas, secas ou excesso de chuvas). Saber quando estocar e quando comercializar é parte fundamental da estratégia do produtor rural de sucesso.
          </p>
        </div>
      </div>
    </div>
  );
};
