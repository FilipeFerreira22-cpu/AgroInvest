import React, { useState } from 'react';
import {
  Target,
  Award,
  CheckCircle2,
  Gift,
  Coins,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const MissionsView: React.FC = () => {
  const { state, claimMissionReward } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleClaim = (missionId: string) => {
    const res = claimMissionReward(missionId);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const completedCount = state.missions.filter((m) => m.completed).length;

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {feedback && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Topo de Missões */}
      <div className="bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span>Missões de Educação Financeira & Agronegócio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cumpra objetivos práticos para dominar a formação de patrimônio, gestão de riscos e sustentabilidade da terra.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-bold">
            {completedCount} de {state.missions.length} Concluídas
          </span>
        </div>
      </div>

      {/* Grid de Missões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.missions.map((mission) => {
          return (
            <div
              key={mission.id}
              className={`border rounded-2xl p-4 shadow-md flex flex-col justify-between transition-all ${
                mission.completed
                  ? 'bg-emerald-950/30 border-emerald-600/60 shadow-emerald-950/30'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{mission.title}</span>
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      mission.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {mission.completed ? 'Pronta p/ Resgatar' : 'Em Andamento'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {mission.description}
                </p>

                {/* Objetivo Educativo */}
                <div className="bg-slate-950/80 rounded-xl p-2.5 text-[11px] text-emerald-300/90 border border-emerald-900/40 flex items-start gap-2 mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{mission.educationalGoal}</span>
                </div>
              </div>

              {/* Recompensa e Botão */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-amber-300 font-bold font-mono">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    +R$ {mission.rewardCoins.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-300 font-bold font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    +{mission.rewardXp} XP
                  </span>
                </div>

                {mission.completed && (
                  <button
                    onClick={() => handleClaim(mission.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 font-display"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Resgatar Recompensa</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção de Conquistas (Achievements) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg mt-8">
        <h3 className="font-bold text-white text-base font-display flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Quadro de Conquistas da Fazenda</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.achievements.map((ach) => {
            const isUnlocked = ach.unlockedAtDay !== null;

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-600/40 text-slate-200'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-50 text-slate-500'
                }`}
              >
                <span className="text-3xl shrink-0">{ach.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-white">{ach.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {ach.description}
                  </p>
                  <span className="text-[10px] text-amber-400 font-mono mt-1 block">
                    {isUnlocked ? `Desbloqueado no Dia ${ach.unlockedAtDay}` : `Bloqueado (+${ach.xpReward} XP)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
