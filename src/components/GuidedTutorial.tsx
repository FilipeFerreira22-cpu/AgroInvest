import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TutorialStep {
  step: number;
  title: string;
  description: string;
  highlightTarget?: string;
  recommendedAction: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    step: 1,
    title: '1. Conheça seu Saldo Inicial',
    description: 'Sua fazenda começa com R$ 500,00 de capital de giro concedido no primeiro login. Este dinheiro deve ser gerido com cuidado para bancar suas primeiras sementes e insumos.',
    recommendedAction: 'Observe a barra superior com Caixa Disponível, Reserva e Patrimônio Líquido.',
  },
  {
    step: 2,
    title: '2. Abra a Primeira Missão',
    description: 'Missões diárias ensinam boas práticas e pagam recompensas em moedas e experiência (XP) ao serem concluídas.',
    recommendedAction: 'Clique na aba "Missões & Metas" para verificar os objetivos ativos.',
  },
  {
    step: 3,
    title: '3. Plante sua Primeira Cultura',
    description: 'Nos canteiros da aba "Minha Fazenda", escolha uma cultura. Hortaliças crescem rápido (2 dias) e geram fluxo de caixa para iniciantes.',
    recommendedAction: 'Clique em um canteiro vazio e plante Hortaliças Orgânicas.',
  },
  {
    step: 4,
    title: '4. Conclua o Trabalho Agrícola',
    description: 'Culturas precisam de água e nutrientes para atingir a produtividade máxima. Se o solo secar ou for atacado por pragas, você perderá parte da colheita.',
    recommendedAction: 'Utilize o botão "Regar Todos" ou clique em "Regar" no canteiro.',
  },
  {
    step: 5,
    title: '5. Faça a Primeira Colheita',
    description: 'Quando os dias de crescimento forem completados, o canteiro ficará maduro com um brilho dourado.',
    recommendedAction: 'Clique em "Colher Safra" para guardar os alimentos no armazém.',
  },
  {
    step: 6,
    title: '6. Reserve Sementes para o Próximo Ciclo',
    description: 'Regra de ouro da sustentabilidade agrícola: nunca venda tudo! Reserve a quantidade recomendada para o próximo plantio a custo zero de semente.',
    recommendedAction: 'Na aba "Armazém & Vendas", clique em "Auto-Reservar Sementes".',
  },
  {
    step: 7,
    title: '7. Venda Parte da Produção',
    description: 'Venda o excedente livre no mercado agrícola. Os preços oscilam diariamente com as chuvas e eventos econômicos.',
    recommendedAction: 'Clique em "Vender 50%" ou "Vender Tudo" para receber moedas na conta.',
  },
  {
    step: 8,
    title: '8. Conheça sua Reserva de Emergência',
    description: 'Separe uma quantia para imprevistos. O dinheiro na reserva fica protegido e evita que você tome dívidas quando ocorrerem secas.',
    recommendedAction: 'Clique em "Ajustar" na Reserva de Emergência no topo e guarde pelo menos R$ 100.',
  },
  {
    step: 9,
    title: '9. Visite o Mercado Financeiro',
    description: 'Conheça títulos do Tesouro Nacional, CDBs com garantia do FGC, Ações da B3 e Fundos Imobiliários.',
    recommendedAction: 'Abra a aba "Mercado Financeiro" e explore as categorias.',
  },
  {
    step: 10,
    title: '10. Faça seu Primeiro Investimento',
    description: 'Títulos como o Tesouro Selic e CDBs 110% do CDI remuneram seu dinheiro todos os dias com juros compostos.',
    recommendedAction: 'Aplique em Tesouro Selic ou CDB Liquidez Diária para começar a render.',
  },
  {
    step: 11,
    title: '11. Consulte o Relatório Diário',
    description: 'Ao clicar em "Concluir Dia" no cabeçalho, o calendário avança e você recebe o balanço contábil completo com a seção "Por que isso aconteceu?".',
    recommendedAction: 'Parabéns! Você dominou o ciclo completo do AgroInvest.',
  },
];

interface GuidedTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManual: () => void;
}

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  isOpen,
  onClose,
  onOpenManual,
}) => {
  const { markTutorialCompleted, resetTutorial } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = TUTORIAL_STEPS[currentStepIndex];
  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      markTutorialCompleted();
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    markTutorialCompleted();
    onClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    resetTutorial();
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-2 sm:right-4 z-40 max-w-md w-full px-2 sm:px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500/80 rounded-3xl p-5 shadow-2xl text-slate-100 relative">
        {/* Topo do Card de Tutorial */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Tutorial Guiado ({current.step}/{TUTORIAL_STEPS.length})
              </span>
              <h3 className="font-bold text-sm text-white font-display">
                {current.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
            title="Minimizar tutorial"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Conteúdo do Passo */}
        <div className="py-3 space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">
            {current.description}
          </p>

          <div className="bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl text-[11px] text-emerald-200 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Ação sugerida:</strong> {current.recommendedAction}</span>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleSkip}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Pular tutorial
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenManual}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Ver manual
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 font-display"
            >
              <span>{isLast ? 'Concluir' : 'Próximo'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
