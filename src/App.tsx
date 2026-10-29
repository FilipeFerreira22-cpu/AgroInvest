import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { FarmView } from './components/FarmView';
import { WarehouseView } from './components/WarehouseView';
import { InvestirView } from './components/InvestirView';
import { MissionsView } from './components/MissionsView';
import { HistoryView } from './components/HistoryView';
import { AppSettingsView } from './components/AppSettingsView';
import { LandingPage } from './components/LandingPage';
import { DailyReportModal } from './components/DailyReportModal';
import { EducationalGlossaryModal } from './components/EducationalGlossaryModal';
import { CalculatorModal } from './components/CalculatorModal';
import { PlayerManualModal } from './components/PlayerManualModal';
import { HelpCenterModal } from './components/HelpCenterModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { GuidedTutorial } from './components/GuidedTutorial';
import { AgroGuiaChatModal } from './components/AgroGuiaChatModal';
import { MobileAppInstallModal } from './components/MobileAppInstallModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import {
  LayoutDashboard,
  Sprout,
  Package,
  TrendingUp,
  Target,
  FileText,
  Loader2,
  Bot,
  Smartphone,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'fazenda'
  | 'armazem'
  | 'investir'
  | 'missoes'
  | 'extrato'
  | 'app';

function MainAppContent() {
  const { user, profile, loading: authLoading } = useAuth();
  const { state, isGameLoading } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modais de apoio
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAgroGuiaOpen, setIsAgroGuiaOpen] = useState(false);
  const [isMobileInstallOpen, setIsMobileInstallOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  // Exibe tela de carregamento suave enquanto autentica ou restaura os dados da nuvem
  const isLoadingSession = authLoading || (Boolean(user) && isGameLoading);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center shadow-2xl mb-4 animate-bounce">
          <Sprout className="w-9 h-9 text-emerald-950" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">AgroInvest</h2>
        <p className="text-xs text-emerald-400 mt-1 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>
            {profile?.displayName
              ? `Restaurando fazenda de ${profile.displayName}...`
              : 'Carregando sua fazenda na nuvem...'}
          </span>
        </p>
        <span className="text-[10px] text-slate-500 mt-2 font-mono">
          Cloud Firestore • Persistência local segura
        </span>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, exibe a Landing Page de Entrada e Cadastro
  if (!user) {
    return (
      <>
        <OfflineBanner />
        <LandingPage
          onOpenManual={() => setIsManualOpen(true)}
          onOpenMobileInstall={() => setIsMobileInstallOpen(true)}
        />
        <PlayerManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        <MobileAppInstallModal
          isOpen={isMobileInstallOpen}
          onClose={() => setIsMobileInstallOpen(false)}
        />
      </>
    );
  }

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fazenda', label: 'Fazenda', icon: <Sprout className="w-4 h-4" /> },
    { id: 'armazem', label: 'Armazém', icon: <Package className="w-4 h-4" /> },
    { id: 'investir', label: 'Investir', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'missoes', label: 'Missões', icon: <Target className="w-4 h-4" /> },
    { id: 'extrato', label: 'Extrato', icon: <FileText className="w-4 h-4" /> },
    { id: 'app', label: 'App', icon: <Smartphone className="w-4 h-4" /> },
  ];

  const shouldShowGuidedTutorial = profile && !profile.tutorialCompleted;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-emerald-950">
      {/* Alerta de Conectividade Offline */}
      <OfflineBanner />

      {/* Cabeçalho Inteligente e Adaptativo (Recolhe para barra compacta ao rolar) */}
      <Header
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAgroGuia={() => setIsAgroGuiaOpen(true)}
        onOpenMobileInstall={() => setIsMobileInstallOpen(true)}
        onNavigateTab={setActiveTab}
        activeTab={activeTab}
        showReserveModalProp={isReserveModalOpen}
        onCloseReserveModalProp={() => setIsReserveModalOpen(false)}
      />

      {/* Navegação por Abas para Desktop e Tablets */}
      <nav className="bg-slate-900/90 border-b border-slate-800/80 sticky top-[52px] sm:top-[56px] z-30 shadow-md backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal da Aba Ativa com rolagem vertical natural e suave */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6 pb-24 md:pb-8 safe-area-left safe-area-right">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={setActiveTab}
            onOpenAgroGuia={() => setIsAgroGuiaOpen(true)}
            onOpenReserveModal={() => setIsReserveModalOpen(true)}
          />
        )}
        {activeTab === 'fazenda' && <FarmView />}
        {activeTab === 'armazem' && <WarehouseView />}
        {activeTab === 'investir' && <InvestirView />}
        {activeTab === 'missoes' && <MissionsView />}
        {activeTab === 'extrato' && <HistoryView />}
        {activeTab === 'app' && (
          <AppSettingsView
            onOpenManual={() => setIsManualOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenMobileInstall={() => setIsMobileInstallOpen(true)}
          />
        )}
      </main>

      {/* Botão Flutuante do Assistente AgroGuia (acima da barra de navegação com safe-area) */}
      <button
        onClick={() => setIsAgroGuiaOpen(true)}
        title="Conversar com AgroGuia"
        className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+68px)] md:bottom-6 right-3 md:right-6 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold shadow-2xl shadow-emerald-950/80 border border-amber-300/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-950/40 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] sm:text-xs font-bold leading-none">AgroGuia</span>
          <span className="text-[8px] sm:text-[10px] text-amber-100/90 font-normal leading-none mt-0.5">Assistente IA</span>
        </div>
      </button>

      {/* Barra Inferior de Navegação no Celular (Touch-Friendly >= 48x48px) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAgroGuia={() => setIsAgroGuiaOpen(true)}
        missionsBadgeCount={state.missions.filter((m) => m.completed).length}
      />

      {/* Modais Globais de Apoio e Educação */}
      <DailyReportModal />
      <EducationalGlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      <PlayerManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      <HelpCenterModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <AgroGuiaChatModal isOpen={isAgroGuiaOpen} onClose={() => setIsAgroGuiaOpen(false)} />
      <MobileAppInstallModal isOpen={isMobileInstallOpen} onClose={() => setIsMobileInstallOpen(false)} />
      <PlayerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Tutorial Guiado para Novos Jogadores */}
      <GuidedTutorial
        isOpen={shouldShowGuidedTutorial || isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onOpenManual={() => setIsManualOpen(true)}
      />

      {/* Rodapé Institucional e Educativo */}
      <footer className="bg-slate-950 border-t border-slate-850 py-6 text-center text-xs text-slate-500 mt-auto hidden md:block">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            AgroInvest — Plante hoje, invista no amanhã
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Este jogo é uma simulação educacional voltada para o aprendizado de princípios de finanças pessoais e agronegócio.
            Todas as moedas, cotações e rendimentos são estritamente fictícios e não podem ser convertidos em dinheiro real.
            Não constitui recomendação de investimento. Conteúdos alinhados com as diretrizes de educação financeira da CVM, Banco Central e Tesouro Nacional.
          </p>
          <p className="text-[10px] text-slate-600 pt-1 font-mono">
            Versão Mobile PWA & Capacitor • Armazenamento Local Seguro • Cloud Firestore Ativo
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <MainAppContent />
      </GameProvider>
    </AuthProvider>
  );
}
