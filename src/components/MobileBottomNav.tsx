import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Package,
  TrendingUp,
  Target,
  Smartphone,
} from 'lucide-react';
import { TabType } from '../App';

interface MobileBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAgroGuia: () => void;
  missionsBadgeCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  missionsBadgeCount = 0,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-emerald-900/40 px-1 pt-1 pb-[max(env(safe-area-inset-bottom,0px),6px)] shadow-2xl safe-area-bottom safe-area-left safe-area-right"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex-1 max-w-[68px] min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Visão Geral do Patrimônio e Indicadores"
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'dashboard' ? 'bg-emerald-500/20 shadow-sm' : ''
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Painel</span>
        </button>

        {/* 2. Fazenda */}
        <button
          onClick={() => onSelectTab('fazenda')}
          className={`flex-1 max-w-[68px] min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
            activeTab === 'fazenda'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Minha Fazenda e Lavouras"
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'fazenda' ? 'bg-emerald-500/20 shadow-sm' : ''
            }`}
          >
            <Sprout className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Fazenda</span>
        </button>

        {/* 3. Armazém */}
        <button
          onClick={() => onSelectTab('armazem')}
          className={`flex-1 max-w-[68px] min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
            activeTab === 'armazem'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Armazém de Colheitas e Sementes"
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'armazem' ? 'bg-emerald-500/20 shadow-sm' : ''
            }`}
          >
            <Package className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Armazém</span>
        </button>

        {/* 4. Investir */}
        <button
          onClick={() => onSelectTab('investir')}
          className={`flex-1 max-w-[68px] min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
            activeTab === 'investir'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mercado Financeiro e Carteira"
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'investir' ? 'bg-emerald-500/20 shadow-sm' : ''
            }`}
          >
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Investir</span>
        </button>

        {/* 5. Missões */}
        <button
          onClick={() => onSelectTab('missoes')}
          className={`flex-1 max-w-[68px] min-h-[44px] relative flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
            activeTab === 'missoes'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Missões e Metas Diárias"
        >
          <div
            className={`p-1 rounded-lg relative ${
              activeTab === 'missoes' ? 'bg-emerald-500/20 shadow-sm' : ''
            }`}
          >
            <Target className="w-4.5 h-4.5" />
            {missionsBadgeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-emerald-950 font-bold text-[9px] flex items-center justify-center">
                {missionsBadgeCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Missões</span>
        </button>

        {/* 6. App / Configurações */}
        <button
          onClick={() => onSelectTab('app')}
          className={`flex-1 max-w-[68px] min-h-[44px] flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer ${
            activeTab === 'app'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Configurações do Aplicativo e Armazenamento Local"
        >
          <div
            className={`p-1 rounded-lg ${
              activeTab === 'app' ? 'bg-emerald-500/20 shadow-sm' : ''
            }`}
          >
            <Smartphone className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">App</span>
        </button>
      </div>
    </nav>
  );
};
