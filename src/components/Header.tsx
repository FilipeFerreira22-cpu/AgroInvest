import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Shield,
  Coins,
  TrendingUp,
  Landmark,
  Calendar,
  Zap,
  HelpCircle,
  Calculator,
  RotateCcw,
  BookOpen,
  Cloud,
  CloudOff,
  RefreshCw,
  AlertCircle,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { calculateNetWorth } from '../utils/financeEngine';
import { useAuth } from '../context/AuthContext';
import { TabType } from '../App';

interface HeaderProps {
  onOpenGlossary: () => void;
  onOpenCalculator: () => void;
  onOpenProfile: () => void;
  onOpenManual: () => void;
  onOpenHelp: () => void;
  onOpenAgroGuia?: () => void;
  onOpenMobileInstall?: () => void;
  onNavigateTab?: (tab: TabType) => void;
  activeTab?: TabType;
  showReserveModalProp?: boolean;
  onCloseReserveModalProp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGlossary,
  onOpenCalculator,
  onOpenProfile,
  onOpenManual,
  onOpenHelp,
  onOpenAgroGuia,
  onOpenMobileInstall,
  onNavigateTab,
  activeTab,
  showReserveModalProp,
  onCloseReserveModalProp,
}) => {
  const { profile } = useAuth();
  const {
    state,
    advanceDay,
    setGameMode,
    resetGame,
    depositEmergencyReserve,
    withdrawEmergencyReserve,
    syncStatus,
    saveNow,
    lastSyncedAt,
  } = useGame();

  const [isScrolled, setIsScrolled] = useState(false);
  const [internalShowReserveModal, setInternalShowReserveModal] = useState(false);
  const [reserveInput, setReserveInput] = useState('');
  const [reserveAction, setReserveAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showReserveModal = showReserveModalProp ?? internalShowReserveModal;
  const setShowReserveModal = (val: boolean) => {
    setInternalShowReserveModal(val);
    if (!val && onCloseReserveModalProp) {
      onCloseReserveModalProp();
    }
  };

  const { netWorth } = calculateNetWorth(state);

  // Monitora a rolagem suave com histerese (elimina bug de oscilação / salto no Android WebView)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
          setIsScrolled((prev) => {
            // Histerese com zona morta: só recolhe após 80px; só restaura ao voltar bem próximo ao topo (< 15px)
            if (!prev && scrollY > 80) return true;
            if (prev && scrollY < 15) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(reserveInput);
    if (isNaN(val) || val <= 0) return;

    if (reserveAction === 'deposit') {
      depositEmergencyReserve(val);
    } else {
      withdrawEmergencyReserve(val);
    }
    setReserveInput('');
    setShowReserveModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-800/40 text-slate-100 shadow-xl transition-all duration-300 pt-[max(env(safe-area-inset-top,0px),0px)] safe-area-left safe-area-right">
      {/* 1. BARRA SUPERIOR ADAPTÁVEL (COMPACTA AO ROLAR / COMPLETA NO TOPO) */}
      <div className={`max-w-7xl mx-auto px-2.5 sm:px-6 transition-all duration-300 ${
        isScrolled ? 'py-1 sm:py-2' : 'py-2 sm:py-2.5'
      }`}>
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 flex-wrap">
          {/* Logo e Nome */}
          <div
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer shrink-0"
            onClick={() => {
              if (isScrolled) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              if (onNavigateTab) onNavigateTab('dashboard');
            }}
            title="Ir para o Dashboard"
          >
            <div className={`rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center shadow-md transition-all duration-300 ${
              isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
            }`}>
              <Sprout className={`text-emerald-950 transition-all duration-300 ${
                isScrolled ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-4.5 h-4.5 sm:w-5 sm:h-5'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className={`font-extrabold tracking-tight text-white font-display transition-all duration-300 ${
                  isScrolled ? 'text-xs sm:text-base' : 'text-sm sm:text-lg'
                }`}>
                  AgroInvest
                </span>
                {!isScrolled && (
                  <span className="text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden xs:inline">
                    Brasil
                  </span>
                )}
              </div>
              {!isScrolled && (
                <p className="text-[9px] sm:text-[10px] text-emerald-400/80 hidden sm:block">
                  Plante hoje, invista no amanhã
                </p>
              )}
            </div>
          </div>

          {/* Indicadores Dinâmicos (Ao rolar: exibe Caixa + Energia em destaque compacto) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
            {/* Saldo de Caixa (Visível em modo compacto para acompanhamento contínuo) */}
            {isScrolled && (
              <div
                className="flex items-center gap-1 bg-slate-950/90 border border-emerald-500/40 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs animate-in fade-in duration-200"
                title="Caixa Disponível"
              >
                <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-bold text-white font-mono text-[10px] sm:text-xs whitespace-nowrap">
                  R$ {state.cashAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* Dia da Simulação */}
            <div className={`items-center gap-1 bg-slate-800/80 border border-slate-700/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs ${
              isScrolled ? 'hidden md:flex' : 'flex'
            }`}>
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span className="text-slate-300 text-[10px] sm:text-[11px] hidden xs:inline">Dia</span>
              <span className="font-bold text-amber-300 text-[10px] sm:text-xs font-mono">{state.day}</span>
            </div>

            {/* Energia Diária */}
            <div
              className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs"
              title="Energia Diária para Tarefas"
            >
              <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${state.energy > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
              <span className="font-bold text-yellow-300 font-mono text-[10px] sm:text-xs">
                {state.energy}/{state.maxEnergy}
              </span>
            </div>

            {/* Nível do Produtor (Desktop) */}
            {!isScrolled && (
              <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2 py-1 rounded-xl text-xs">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">
                  Nv.{state.playerLevel}
                </span>
                <div className="w-10 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(state.playerXp / state.xpForNextLevel) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Sutil Nuvem / Sincronização */}
            <button
              onClick={() => saveNow()}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold border transition-all cursor-pointer ${
                syncStatus === 'saving'
                  ? 'bg-blue-950/70 border-blue-500/50 text-blue-300'
                  : syncStatus === 'synced'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
              }`}
              title={
                syncStatus === 'saving'
                  ? 'Salvando alterações...'
                  : syncStatus === 'synced'
                  ? 'Sincronizado na nuvem.'
                  : 'Salvo localmente (offline).'
              }
            >
              {syncStatus === 'saving' ? (
                <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <Cloud className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
              ) : (
                <CloudOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              )}
            </button>

            {/* Perfil do Jogador */}
            {profile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-emerald-500/40 text-xs text-white font-bold transition-all cursor-pointer"
                title={`Perfil de ${profile.displayName}`}
              >
                <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center text-slate-950 text-[9px] sm:text-[10px] font-black font-display shrink-0">
                  {profile.displayName.slice(0, 1).toUpperCase()}
                </div>
                {!isScrolled && (
                  <span className="truncate max-w-[70px] text-[10px] hidden xs:inline">{profile.displayName}</span>
                )}
              </button>
            )}

            {/* Concluir Dia */}
            <button
              onClick={() => advanceDay()}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs shadow-md transition border border-emerald-400/30 cursor-pointer min-h-[28px] sm:min-h-[32px]"
              title="Avançar para o próximo dia"
            >
              <span className={isScrolled ? 'hidden sm:inline' : 'inline'}>Concluir Dia</span>
              <span className="text-[9px] font-bold">➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PAINEL FINANCEIRO INTEGRADO (RECOLHE SUAVEMENTE COM TRANSIÇÃO CSS AO ROLAR) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-800/70 bg-slate-950/70 ${
          isScrolled
            ? 'max-h-0 opacity-0 pointer-events-none -translate-y-1'
            : 'max-h-48 opacity-100 translate-y-0 py-1.5 px-2.5 sm:px-6'
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
          {/* 1. Saldo Disponível */}
          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-lg p-1.5 sm:p-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-medium">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>Caixa Disponível</span>
              </div>
              <div className="text-[11px] sm:text-sm font-bold text-white tracking-tight font-mono">
                R$ {state.cashAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* 2. Reserva de Emergência */}
          <div className="bg-slate-900/80 border border-blue-900/50 rounded-lg p-1.5 sm:p-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-blue-400 font-medium">
                <Shield className="w-3 h-3 text-blue-400" />
                <span>Reserva</span>
              </div>
              <div className="text-[11px] sm:text-sm font-bold text-white tracking-tight font-mono">
                R$ {state.emergencyReserve.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <button
              onClick={() => setShowReserveModal(true)}
              className="text-[9px] px-1.5 py-0.5 bg-blue-950/90 hover:bg-blue-800 text-blue-300 border border-blue-700/60 rounded transition cursor-pointer"
            >
              Ajustar
            </button>
          </div>

          {/* 3. Valor Investido */}
          <div className="bg-slate-900/80 border border-purple-900/50 rounded-lg p-1.5 sm:p-2">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-purple-400 font-medium">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span>Investimentos</span>
            </div>
            <div className="text-[11px] sm:text-sm font-bold text-white tracking-tight font-mono">
              R${' '}
              {state.userPositions
                .reduce((acc, p) => acc + p.currentValue, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* 4. Valor da Fazenda */}
          <div className="bg-slate-900/80 border border-amber-900/50 rounded-lg p-1.5 sm:p-2 hidden sm:block">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-amber-400 font-medium">
              <Landmark className="w-3 h-3 text-amber-400" />
              <span>Terra & Bens</span>
            </div>
            <div className="text-[11px] sm:text-sm font-bold text-white tracking-tight font-mono">
              R${' '}
              {(state.farmLandValue + state.toolsEquipmentValue).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* 5. Patrimônio Líquido Total */}
          <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-lg p-1.5 sm:p-2 col-span-2 sm:col-span-1 shadow-inner flex items-center justify-between sm:block">
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              <span>Patrimônio</span>
              <span className="text-[8px] text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded hidden sm:inline">
                Total
              </span>
            </div>
            <div className="text-xs sm:text-base font-black text-emerald-200 tracking-tight font-display font-mono">
              R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Gestão da Reserva de Emergência */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-slate-900 border border-blue-600/40 rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2.5 text-blue-400 mb-2 sm:mb-3">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="font-bold text-base sm:text-lg text-white font-display">Reserva de Emergência</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mb-3 leading-relaxed">
              A Reserva de Emergência protege sua fazenda contra perdas de colheita, quebras de maquinário e oscilações do mercado.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setReserveAction('deposit')}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  reserveAction === 'deposit'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Guardar na Reserva
              </button>
              <button
                type="button"
                onClick={() => setReserveAction('withdraw')}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  reserveAction === 'withdraw'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Resgatar para Caixa
              </button>
            </div>

            <form onSubmit={handleReserveSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Valor em Moedas Fictícias (R$)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  max={reserveAction === 'deposit' ? state.cashAvailable : state.emergencyReserve}
                  value={reserveInput}
                  onChange={(e) => setReserveInput(e.target.value)}
                  placeholder="Ex: 100.00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {reserveAction === 'deposit'
                    ? `Disponível no caixa: R$ ${state.cashAvailable.toFixed(2)}`
                    : `Na reserva: R$ ${state.emergencyReserve.toFixed(2)}`}
                </span>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowReserveModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 cursor-pointer"
                >
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-600/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-base text-red-400 mb-2 font-display">Reiniciar Partida?</h3>
            <p className="text-xs text-slate-300 mb-4">
              Isso apagará o progresso salvo e reiniciará a fazenda no Dia 1 com as condições iniciais. Deseja continuar?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  resetGame();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
