import React from 'react';
import {
  User as UserIcon,
  X,
  LogOut,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Shield,
  Coins,
  TrendingUp,
  Sprout,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { calculateNetWorth } from '../utils/financeEngine';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManual: () => void;
  onOpenHelp: () => void;
  onOpenTutorial: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenManual,
  onOpenHelp,
  onOpenTutorial,
}) => {
  const { user, profile, logout, resetTutorial } = useAuth();
  const { state, saveNow } = useGame();

  if (!isOpen || !profile) return null;

  const { netWorth } = calculateNetWorth(state);

  const handleLogout = async () => {
    try {
      await saveNow();
    } catch (err) {
      console.warn('Erro ao salvar antes do logout:', err);
    }
    onClose();
    await logout();
  };

  const handleRestartTutorial = async () => {
    await resetTutorial();
    onClose();
    onOpenTutorial();
  };

  const formattedDate = new Date(profile.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Topo do Perfil com Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg font-display">
            {profile.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">
                {profile.displayName}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Nível {state.playerLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Produtor rural desde {formattedDate}
            </p>
          </div>
        </div>

        {/* Mensagem de Boas-vindas Solicitada */}
        <div className="my-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 text-xs text-emerald-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Bem-vindo de volta à sua fazenda! Vamos continuar construindo seu patrimônio através da terra e do mercado financeiro.
          </p>
        </div>

        {/* Estatísticas Gerais do Jogador */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Patrimônio Atual</span>
            <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">
              R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Colheitas Efetuadas</span>
            <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
              {state.totalHarvestsCount} safras
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Dia no Calendário</span>
            <span className="text-sm sm:text-base font-black text-white font-mono">
              Dia #{state.day}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Dividendos B3</span>
            <span className="text-sm sm:text-base font-black text-purple-300 font-mono">
              R$ {state.totalDividendsEarned.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Ações e Navegação do Perfil */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenManual();
            }}
            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Manual do Jogador (10 Capítulos)</span>
            </div>
            <span className="text-slate-500 text-xs">➔</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenHelp();
            }}
            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Central de Ajuda & Perguntas Frequentes</span>
            </div>
            <span className="text-slate-500 text-xs">➔</span>
          </button>

          <button
            onClick={handleRestartTutorial}
            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reiniciar Tutorial Guiado</span>
            </div>
            <span className="text-slate-500 text-xs">➔</span>
          </button>
        </div>

        {/* Botão de Logout */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">
            {profile.email}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
