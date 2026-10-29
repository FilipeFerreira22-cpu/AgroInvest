import React, { useState } from 'react';
import {
  Smartphone,
  Database,
  Cloud,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Calculator,
  Compass,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { GameMode } from '../types/game';

interface AppSettingsViewProps {
  onOpenManual: () => void;
  onOpenHelp: () => void;
  onOpenCalculator: () => void;
  onOpenGlossary: () => void;
  onOpenTutorial: () => void;
  onOpenMobileInstall: () => void;
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  onOpenManual,
  onOpenHelp,
  onOpenCalculator,
  onOpenGlossary,
  onOpenTutorial,
  onOpenMobileInstall,
}) => {
  const { profile } = useAuth();
  const {
    state,
    setGameMode,
    resetGame,
    syncStatus,
    saveNow,
    lastSyncedAt,
  } = useGame();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncFeedback('Sincronizando com armazenamento local e Cloud Firestore...');
    await saveNow();
    setTimeout(() => {
      setSyncFeedback('Sincronização concluída com sucesso!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 600);
  };

  const handleConfirmReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Notificação de Sincronização */}
      {syncFeedback && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Cabeçalho do App & Status Geral */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/50 border border-emerald-800/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              AgroInvest — Configurações do App
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Identificador: <span className="font-mono text-emerald-400">br.com.agroinvest.app</span> • Versão Mobile Híbrida 1.0.0
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMobileInstall}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Instalar no Celular</span>
        </button>
      </div>

      {/* Grid de Configurações Técnicas & Persistência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Armazenamento Local Seguro */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Armazenamento Local do Aparelho</span>
            </h2>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
              Ativo
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Seu progresso é gravado localmente neste dispositivo de forma automática após cada ação (plantio, colheita, compras e investimentos). Não se perde ao fechar o app ou perder o sinal de internet.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tecnologia de Persistência:</span>
              <span className="font-mono text-slate-200">SQLite / IndexedDB Seguro</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status do Cache Local:</span>
              <span className="font-mono text-emerald-400 font-bold">Ativo & Seguro</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estado da Fazenda:</span>
              <span className="font-mono text-slate-200">{state.plots.length} canteiros gravados</span>
            </div>
          </div>
        </div>

        {/* Nuvem Firebase & Sincronização */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <span>Sincronização Cloud Firestore</span>
            </h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : syncStatus === 'saving'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {syncStatus === 'synced' ? 'Nuvem Conectada' : syncStatus === 'saving' ? 'Salvando...' : 'Cache Local'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Permite recuperar seu progresso em outro celular ao entrar com a mesma conta. Ao reconectar à internet, alterações pendentes são sincronizadas automaticamente sem duplicar dados.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Conta Vinculada:</span>
              <span className="font-mono text-slate-200 truncate max-w-[200px]">{profile?.displayName || 'Jogador'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Última Sincronização:</span>
              <span className="font-mono text-slate-200">
                {lastSyncedAt ? lastSyncedAt.toLocaleTimeString('pt-BR') : 'Hoje'}
              </span>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronizar Manualmente Agora</span>
          </button>
        </div>
      </div>

      {/* Modo de Jogo & Preferências */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Modo de Jogo & Dificuldade</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              {
                mode: 'aprendizagem',
                title: 'Aprendizagem',
                desc: 'Ritmo suave com dicas didáticas, pragas amenas e maior tolerância financeira.',
              },
              {
                mode: 'realista',
                title: 'Realista',
                desc: 'Flutuações de mercado brasileiras fieis, custos operacionais e clima dinâmico.',
              },
              {
                mode: 'desafio',
                title: 'Desafio',
                desc: 'Volatilidade alta, eventos econômicos frequentes e margem operacional estreita.',
              },
            ] as const
          ).map((item) => (
            <button
              key={item.mode}
              onClick={() => setGameMode(item.mode)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                state.gameMode === item.mode
                  ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white capitalize">{item.title}</span>
                {state.gameMode === item.mode && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recursos Educativos & Tutoriais */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Manuais, Glossário & Tutoriais</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenManual}
            className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="font-bold text-xs text-white block">Manual do Jogador</span>
            <span className="text-[10px] text-slate-400">10 capítulos práticos</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition cursor-pointer"
          >
            <span className="font-bold text-xs text-amber-400 mb-1 block">ABC</span>
            <span className="font-bold text-xs text-white block">Glossário CVM/B3</span>
            <span className="text-[10px] text-slate-400">Termos financeiros</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-blue-400 mb-1" />
            <span className="font-bold text-xs text-white block">Calculadora Juros</span>
            <span className="text-[10px] text-slate-400">Simulador de aportes</span>
          </button>

          <button
            onClick={onOpenTutorial}
            className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition cursor-pointer"
          >
            <Compass className="w-4 h-4 text-purple-400 mb-1" />
            <span className="font-bold text-xs text-white block">Reiniciar Tutorial</span>
            <span className="text-[10px] text-slate-400">Passo a passo inicial</span>
          </button>
        </div>
      </div>

      {/* Zona de Perigo: Reiniciar Jogo */}
      <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-red-300 text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Reiniciar Simulação da Fazenda</span>
          </h3>
          <p className="text-xs text-red-400/80 mt-0.5">
            Restaura o saldo inicial para R$ 500,00 e reseta os canteiros, estoques e posições.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3.5 py-2 bg-red-900/50 hover:bg-red-800 border border-red-700 text-red-200 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
        >
          Reiniciar Jogo
        </button>
      </div>

      {/* Modal de Confirmação de Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-600/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-900/50 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Confirmar Reinício</h3>
                <p className="text-xs text-slate-400">Esta ação é irreversível.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza de que deseja recomeçar a jornada do zero? Todo o progresso de safras e investimentos desta conta será reiniciado com R$ 500,00 de capital inicial.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
