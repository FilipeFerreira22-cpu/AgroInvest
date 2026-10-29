import React, { useState } from 'react';
import {
  Sprout,
  Shield,
  Coins,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onOpenManual: () => void;
  onOpenMobileInstall?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenManual,
  onOpenMobileInstall,
}) => {
  const { loginWithGoogle } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (!res.success && res.error) {
      if (res.error !== 'Janela de autenticação fechada antes da conclusão.') {
        setErrorMessage(res.error);
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-emerald-950">
      {/* Barra de Navegação Superior */}
      <header className="border-b border-emerald-900/40 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Sprout className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                AgroInvest
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block">
                Plante hoje, invista no amanhã
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {onOpenMobileInstall && (
              <button
                onClick={onOpenMobileInstall}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/40 rounded-xl transition-all cursor-pointer"
                title="Instalar AgroInvest no Celular (Android / iOS)"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Instalar App</span>
              </button>
            )}

            <button
              onClick={onOpenManual}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-700/50 rounded-xl transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Manual do Jogador</span>
            </button>

            {/* Botão de Login Exclusivo com Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60 active:scale-95"
              title="Entrar com sua conta Google"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoading ? 'Conectando...' : 'Entrar com Google'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Principal */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulador de Agronegócio & Finanças Brasileiras</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display leading-tight">
            Cultive a terra.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Construa seu patrimônio.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Aprenda a administrar o dinheiro de verdade enquanto cuida da sua fazenda. Plante grãos sustentáveis, reserve sementes para o próximo ciclo, forme sua reserva de emergência e invista em Tesouro Direto, CDBs com FGC, Ações e FIIs da B3.
          </p>

          {/* Opção Principal de Acesso com Google */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-3 font-display transition-all cursor-pointer active:scale-95 disabled:opacity-70 border border-slate-200"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoading ? 'Conectando ao Google...' : 'Entrar com o Google'}</span>
            </button>

            <button
              onClick={onOpenManual}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Manual do Jogador</span>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Moedas Fictícias</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Regras CVM & Banco Central</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-teal-400" />
              <span>Progresso Salvo na Nuvem</span>
            </div>
          </div>
        </div>

        {/* Ilustração e Card Interativo da Fazenda Financeira */}
        <div className="flex-1 w-full max-w-lg">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚜</span>
                <div>
                  <h3 className="font-bold text-white text-sm">Fazenda AgroInvest</h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Simulação em Tempo Real</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Safra Sustentável
              </span>
            </div>

            {/* Simulação Visual de Canteiros */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Milho Híbrido</span>
                  <span className="text-amber-400 font-bold font-mono">Dia 3/3</span>
                </div>
                <div className="text-2xl my-1">🌽</div>
                <span className="text-[10px] text-emerald-400 font-bold">✨ Pronto para Colher</span>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Soja Exportação</span>
                  <span className="text-blue-400 font-bold font-mono">Dia 2/5</span>
                </div>
                <div className="text-2xl my-1">🌱</div>
                <span className="text-[10px] text-blue-300">💧 Solo Irrigado</span>
              </div>
            </div>

            {/* Painel Financeiro Educativo */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">💵 Caixa Disponível:</span>
                <span className="text-white font-bold">R$ 500,00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-blue-400">🛡️ Reserva de Emergência:</span>
                <span className="text-blue-300 font-bold">R$ 300,00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-purple-400">📈 Tesouro Selic & CDB:</span>
                <span className="text-purple-300 font-bold">R$ 1.200,00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-sans font-bold">
                <span className="text-emerald-300">Patrimônio Líquido:</span>
                <span className="text-emerald-300 font-mono">R$ 4.500,00</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              Cada colheita é uma oportunidade de aprender a poupar e investir com sabedoria.
            </p>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-400">
            AgroInvest — Plante hoje, invista no amanhã
          </p>
          <p className="text-[11px] text-slate-500">
            Jogo educacional com moedas fictícias brasileiras. Não permite operações financeiras verdadeiras, depósitos ou saques.
          </p>
        </div>
      </footer>

      {/* Modal Informativo / Conectar com Google */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 relative text-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm p-1.5 rounded-lg bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            {/* Cabeçalho do Modal */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/60 mb-3">
              <Sprout className="w-7 h-7 text-emerald-950" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Entrar na sua Fazenda
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Conecte-se com sua conta Google para salvar sua fazenda com segurança na nuvem e continuar seu progresso em qualquer celular ou computador.
            </p>

            {/* Alerta de Erro */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/90 border border-red-500/80 text-red-200 text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Botão de Conectar com Google */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl shadow-emerald-950/40 disabled:opacity-60 active:scale-95"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoading ? 'Conectando ao Google...' : 'Continuar com o Google'}</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Autenticação rápida e segura em 1 clique</span>
              </p>
              <p className="text-slate-500">
                Sem necessidade de senhas ou cadastros manuais adicionais.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
