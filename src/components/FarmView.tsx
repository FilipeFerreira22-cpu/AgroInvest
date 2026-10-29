import React, { useState } from 'react';
import {
  Droplets,
  Sparkles,
  Bug,
  PlusCircle,
  Scissors,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CropType, Plot } from '../types/game';

export const FarmView: React.FC = () => {
  const {
    state,
    plantPlot,
    waterPlot,
    waterAllPlots,
    fertilizePlot,
    fertilizeAllPlots,
    treatPest,
    harvestPlot,
    harvestAllPlots,
    expandPlots,
  } = useGame();

  const [selectedPlotForPlanting, setSelectedPlotForPlanting] = useState<number | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const showFeedback = (res: { message: string; success: boolean }) => {
    setActionFeedback(res);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handlePlantCrop = (cropId: CropType) => {
    if (selectedPlotForPlanting === null) return;
    const res = plantPlot(selectedPlotForPlanting, cropId);
    showFeedback(res);
    if (res.success) {
      setSelectedPlotForPlanting(null);
    }
  };

  const getStageColor = (plot: Plot) => {
    if (plot.stage === 'vazio') return 'bg-amber-950/30 border-amber-900/50';
    if (plot.pestInfestation) return 'bg-red-950/50 border-red-600/70 shadow-red-950/50';
    if (plot.stage === 'maduro') return 'bg-emerald-900/40 border-amber-400 shadow-amber-500/20 farm-pulse';
    if (plot.stage === 'crescendo') return 'bg-emerald-950/50 border-emerald-600/60';
    return 'bg-emerald-950/30 border-emerald-700/40';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Barra de Notificação Rápida */}
      {actionFeedback && (
        <div
          className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
            actionFeedback.success
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : 'bg-red-950/90 border-red-500 text-red-200'
          }`}
        >
          {actionFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Painel de Controles Rápidos da Fazenda (Compacto e bem proporcionado no Mobile) */}
      <div className="bg-slate-900/80 border border-emerald-800/40 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white font-display flex items-center gap-2">
              <span>🌾 Canteiros & Manejo Agrícola</span>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {state.plots.filter((p) => p.crop !== null).length}/{state.plots.length} Cultivados
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Irrigue diariamente, adube o solo e monitore pragas para obter a produtividade máxima.
            </p>
          </div>

          {/* Botões de Ação em Lote */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={() => showFeedback(waterAllPlots())}
              disabled={state.energy < 1}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-blue-200 disabled:opacity-50 transition-all cursor-pointer min-h-[36px]"
            >
              <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Regar Todos</span>
            </button>

            <button
              onClick={() => showFeedback(fertilizeAllPlots())}
              disabled={state.energy < 1 || state.cashAvailable < 15}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/50 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-amber-200 disabled:opacity-50 transition-all cursor-pointer min-h-[36px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Adubar Lavoura</span>
            </button>

            <button
              onClick={() => showFeedback(harvestAllPlots())}
              disabled={state.energy < 1 || !state.plots.some((p) => p.stage === 'maduro')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-white shadow-md shadow-emerald-950 disabled:opacity-40 transition-all cursor-pointer min-h-[36px]"
            >
              <Scissors className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Colher Prontos</span>
            </button>

            {state.plots.length < 8 && (
              <button
                onClick={() => showFeedback(expandPlots())}
                disabled={state.cashAvailable < 800}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-emerald-300 transition-all cursor-pointer min-h-[36px]"
                title="Abrir novo lote de terra (Custo: R$ 800)"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Expandir (+1)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Interativa de Canteiros (2 colunas no celular para harmonia visual) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {state.plots.map((plot) => {
          const crop = plot.crop ? state.cropMarket[plot.crop] : null;
          const isMature = plot.stage === 'maduro';

          return (
            <div
              key={plot.id}
              className={`relative rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-4 transition-all duration-200 flex flex-col justify-between shadow-md ${getStageColor(
                plot
              )}`}
            >
              {/* Cabeçalho do Canteiro */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 font-mono">
                  Canteiro #{plot.id}
                </span>

                {plot.pestInfestation && (
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded-full animate-pulse shadow-sm">
                    <Bug className="w-2.5 h-2.5" />
                    <span>Praga!</span>
                  </span>
                )}

                {isMature && (
                  <span className="text-[9px] sm:text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full shadow-sm font-display">
                    ✨ Pronto!
                  </span>
                )}
              </div>

              {/* Centro Visual da Plantação */}
              <div className="my-1.5 sm:my-2 flex flex-col items-center justify-center min-h-[64px] sm:min-h-[85px]">
                {plot.crop && crop ? (
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl mb-0.5 filter drop-shadow">
                      {crop.icon}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[120px] sm:max-w-none">
                      {crop.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-emerald-300/80 capitalize">
                      {plot.stage === 'plantado' && 'Germinando (Dia 1)'}
                      {plot.stage === 'crescendo' && `${plot.daysPlanted}/${crop.growthDays} dias`}
                      {plot.stage === 'maduro' && 'Pronto!'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <div className="text-2xl sm:text-3xl text-amber-700/60 mb-0.5">🟫</div>
                    <span className="text-[11px] sm:text-xs text-amber-300/80 font-medium block">
                      Terra Arada Vazia
                    </span>
                    <button
                      onClick={() => setSelectedPlotForPlanting(plot.id)}
                      className="mt-1.5 text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all cursor-pointer min-h-[32px]"
                    >
                      🌱 Plantar
                    </button>
                  </div>
                )}
              </div>

              {/* Status do Solo (Água e Nutrientes) */}
              {plot.crop && crop && (
                <div className="space-y-1.5 mt-1.5 pt-1.5 border-t border-slate-700/50 text-[10px] sm:text-[11px]">
                  {/* Umidade */}
                  <div>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span className="flex items-center gap-1 text-blue-300">
                        <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Solo
                      </span>
                      <span className="font-mono">{plot.waterLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          plot.waterLevel < 40 ? 'bg-red-400' : 'bg-blue-400'
                        }`}
                        style={{ width: `${plot.waterLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Nutrientes */}
                  <div>
                    <div className="flex justify-between text-slate-300 mb-0.5">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Adubo
                      </span>
                      <span className="font-mono">{plot.nutrientLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          plot.nutrientLevel < 40 ? 'bg-red-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${plot.nutrientLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Ações Individuais do Canteiro */}
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {plot.pestInfestation ? (
                      <button
                        onClick={() => showFeedback(treatPest(plot.id))}
                        className="col-span-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer min-h-[30px]"
                      >
                        <Bug className="w-3 h-3" />
                        <span>Tratar (R$ 25)</span>
                      </button>
                    ) : isMature ? (
                      <button
                        onClick={() => showFeedback(harvestPlot(plot.id))}
                        className="col-span-2 py-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-lg text-[10px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md font-display min-h-[30px]"
                      >
                        <Scissors className="w-3 h-3" />
                        <span>Colher</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => showFeedback(waterPlot(plot.id))}
                          disabled={plot.waterLevel >= 90 || state.energy < 1}
                          className="py-1 px-1 bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 rounded-lg font-semibold text-[10px] disabled:opacity-40 cursor-pointer min-h-[28px]"
                        >
                          💧 Regar
                        </button>
                        <button
                          onClick={() => showFeedback(fertilizePlot(plot.id))}
                          disabled={plot.nutrientLevel >= 90 || state.cashAvailable < 15 || state.energy < 1}
                          className="py-1 px-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 rounded-lg font-semibold text-[10px] disabled:opacity-40 cursor-pointer min-h-[28px]"
                        >
                          🧪 Adubar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Regra de Sustentabilidade Agrícola - Card Didático */}
      <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-200 text-xs sm:text-sm font-display">
            Regra de Ouro da Sustentabilidade do Agronegócio
          </h4>
          <p className="text-[11px] sm:text-xs leading-relaxed">
            Nunca venda 100% da sua colheita sem planejar o próximo plantio! No <strong>AgroInvest</strong>, você pode usar sementes da sua própria safra anterior (reservadas no armazém) para plantar com <strong>custo de semente R$ 0,00</strong>. Quem gasta todo o caixa e não reserva insumos é obrigado a pegar empréstimos caros.
          </p>
        </div>
      </div>

      {/* Modal de Seleção de Cultura para Plantar */}
      {selectedPlotForPlanting !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base sm:text-lg text-white font-display flex items-center gap-2">
                <span>🌱 Escolha a Cultura para o Canteiro #{selectedPlotForPlanting}</span>
              </h3>
              <button
                onClick={() => setSelectedPlotForPlanting(null)}
                className="text-slate-400 hover:text-white text-xs sm:text-sm px-2 py-1 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 mt-3 sm:mt-4">
              {(Object.keys(state.cropMarket) as CropType[]).map((cropKey) => {
                const crop = state.cropMarket[cropKey];
                const inv = state.inventory[cropKey];
                const isLocked = state.playerLevel < crop.minLevel;
                const hasSeedsReserved = inv.reservedSeeds >= crop.seedsPerCycle;
                const canAfford = hasSeedsReserved || state.cashAvailable >= crop.seedCost;

                return (
                  <div
                    key={crop.id}
                    className={`border rounded-xl p-3 flex flex-col justify-between transition-all ${
                      isLocked
                        ? 'bg-slate-950/60 border-slate-800 opacity-60'
                        : 'bg-slate-850 border-slate-700/80 hover:border-emerald-500/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">{crop.icon}</span>
                          <div>
                            <span className="font-bold text-white text-xs sm:text-sm block">
                              {crop.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {crop.growthDays} dias | ~{crop.baseYield} {crop.unitName}
                            </span>
                          </div>
                        </div>

                        {isLocked && (
                          <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                            Nível {crop.minLevel}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-slate-300 mb-2 leading-relaxed line-clamp-2">
                        {crop.description}
                      </p>

                      <div className="bg-slate-900/90 rounded-lg p-2 text-[10px] space-y-0.5 text-slate-300 font-mono mb-2.5">
                        <div className="flex justify-between">
                          <span>Semente:</span>
                          <span className="font-bold text-amber-300">R$ {crop.seedCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Preço Venda:</span>
                          <span className="text-emerald-300">R$ {crop.currentPrice.toFixed(2)}/{crop.unitName.slice(0, 4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Armazém:</span>
                          <span className={hasSeedsReserved ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {inv.reservedSeeds} un {hasSeedsReserved && '(Grátis!)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlantCrop(crop.id)}
                      disabled={isLocked || !canAfford || state.energy < 1}
                      className={`w-full py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isLocked
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : hasSeedsReserved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer'
                          : canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md cursor-pointer'
                          : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isLocked
                        ? `Nível ${crop.minLevel}`
                        : hasSeedsReserved
                        ? '🌱 Plantar Próprias (R$ 0)'
                        : canAfford
                        ? `🌱 Comprar e Plantar (R$ ${crop.seedCost.toFixed(2)})`
                        : 'Saldo Insuficiente'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
