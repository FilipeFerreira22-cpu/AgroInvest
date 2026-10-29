import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'jogo' | 'financas' | 'conta';
}

const FAQS: FaqItem[] = [
  {
    question: 'Como ganho moedas?',
    answer: 'Você ganha moedas cumprindo missões diárias de trabalho agrícola e financeiro, vendendo o excedente da sua colheita no armazém e recebendo rendimentos e proventos (dividendos) de seus investimentos na B3.',
    category: 'jogo',
  },
  {
    question: 'Por que preciso reservar sementes?',
    answer: 'Na agricultura sustentável, guardar parte da colheita garante que você tenha insumos para replantar no ciclo seguinte com custo de compra R$ 0,00. Quem vende 100% da produção fica sem capital de giro e precisa gastar todo o caixa.',
    category: 'jogo',
  },
  {
    question: 'Onde vejo meus investimentos?',
    answer: 'Na aba "Minha Carteira", você visualiza todas as suas aplicações ativas em custódia, o valor investido original, o valor bruto acumulado, os proventos recebidos e o valor líquido projetado com impostos.',
    category: 'financas',
  },
  {
    question: 'Por que meu investimento perdeu valor?',
    answer: 'Investimentos de renda variável (Ações e Criptoativos) e títulos de renda fixa prefixados/IPCA+ sofrem oscilação diária (Marcação a Mercado). Se os juros sobem ou ocorrem crises de mercado, o valor para resgate antecipado pode cair. Se você mantiver o título até o vencimento, a taxa contratada é honrada.',
    category: 'financas',
  },
  {
    question: 'Qual é a diferença entre saldo e patrimônio?',
    answer: 'Saldo é o dinheiro disponível imediatamente em conta corrente (caixa). Patrimônio Líquido é a soma de todo o seu dinheiro, da reserva de emergência, do valor de mercado dos investimentos e dos bens da fazenda (terras e maquinários), menos as dívidas.',
    category: 'financas',
  },
  {
    question: 'Como salvo meu progresso?',
    answer: 'O AgroInvest realiza salvamento automático na nuvem (Cloud Firestore) vinculado à sua conta autenticada a cada dia concluído e a cada transação realizada. Você continuará exatamente de onde parou ao entrar novamente.',
    category: 'conta',
  },
  {
    question: 'Como recupero minha senha?',
    answer: 'Na tela inicial, clique em "Entrar" e em seguida no link "Esqueci minha senha". Digite seu e-mail cadastrado e um link oficial de redefinição será enviado para sua caixa de entrada.',
    category: 'conta',
  },
  {
    question: 'Como saio da conta?',
    answer: 'Clique no seu nome de usuário no canto superior direito do cabeçalho e selecione a opção "Sair da conta". Sua sessão será encerrada com segurança e seu progresso continuará salvo na nuvem.',
    category: 'conta',
  },
  {
    question: 'O que acontece quando fecho o jogo?',
    answer: 'Sua fazenda permanece pausada no último dia concluído e no exato estado em que você a deixou. Suas plantas não morrerão e seu dinheiro não sumirá.',
    category: 'jogo',
  },
  {
    question: 'O dinheiro do jogo pode ser sacado?',
    answer: 'NÃO. O AgroInvest é exclusivamente um simulador educacional. Todas as moedas, cotações, patrimônios e rendimentos são 100% fictícios e não possuem valor monetário real nem podem ser convertidos em reais.',
    category: 'financas',
  },
];

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const filtered = FAQS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Cabeçalho */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Central de Ajuda & Perguntas Frequentes
              </h2>
              <span className="text-xs text-slate-400">
                Tire suas dúvidas sobre mecânicas da fazenda e finanças
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar dúvida (ex: sacar dinheiro, sementes, resgatar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Lista de Perguntas (Accordion) */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-2.5">
          {filtered.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={index}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 border-t border-slate-850/80 leading-relaxed animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé com Aviso Fictício */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulador Educativo com Moedas Fictícias</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
