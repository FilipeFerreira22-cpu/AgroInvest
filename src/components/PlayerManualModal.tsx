import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Shield,
  TrendingUp,
  Sprout,
  Coins,
  AlertTriangle,
  Landmark,
} from 'lucide-react';

interface ManualChapter {
  id: number;
  title: string;
  icon: string;
  subtitle: string;
  content: React.ReactNode;
}

interface PlayerManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerManualModal: React.FC<PlayerManualModalProps> = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState(1);
  const [readChapters, setReadChapters] = useState<number[]>([1]);

  if (!isOpen) return null;

  const handleSelectChapter = (chId: number) => {
    setActiveChapter(chId);
    if (!readChapters.includes(chId)) {
      setReadChapters((prev) => [...prev, chId]);
    }
  };

  const handleNext = () => {
    if (activeChapter < 10) {
      handleSelectChapter(activeChapter + 1);
    }
  };

  const handlePrev = () => {
    if (activeChapter > 1) {
      handleSelectChapter(activeChapter - 1);
    }
  };

  const readingProgress = Math.round((readChapters.length / 10) * 100);

  const chapters: ManualChapter[] = [
    {
      id: 1,
      title: 'Capítulo 1 — Conhecendo sua fazenda',
      icon: '🌾',
      subtitle: 'Principais elementos da tela e a diferença crucial entre caixa e patrimônio.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Bem-vindo ao <strong>AgroInvest</strong>! O jogo foi projetado para simular o dia a dia de um produtor rural e investidor brasileiro. Veja o que cada elemento da tela representa:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 block mb-0.5">💵 Caixa Disponível</strong>
              <span>Dinheiro livre na conta corrente para comprar sementes, fertilizantes ou realizar novos investimentos.</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-blue-400 block mb-0.5">🛡️ Reserva de Emergência</strong>
              <span>Conta separada para proteger sua fazenda contra secas, pragas ou quebras de safra sem contrair dívidas.</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-amber-400 block mb-0.5">📦 Estoque & Sementes Reservadas</strong>
              <span>Sua produção colhida e a quantidade protegida para replantio imediato a custo zero.</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-purple-400 block mb-0.5">📈 Mercado Financeiro</strong>
              <span>Títulos públicos do Tesouro Direto, CDBs, LCIs, Ações da B3 e Fundos Imobiliários.</span>
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-700/50 p-3.5 rounded-xl text-emerald-200">
            <strong className="block text-emerald-300 font-display mb-1">
              💡 Diferença entre Dinheiro Disponível e Patrimônio Total
            </strong>
            <p>
              Ter <strong>R$ 500 em caixa</strong> não significa que seu patrimônio é de R$ 500! Seu <strong>Patrimônio Total</strong> inclui a terra da fazenda, seus tratores, suas aplicações financeiras e seu saldo em conta, menos quaisquer dívidas existentes.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Capítulo 2 — Como trabalhar e ganhar moedas',
      icon: '🎯',
      subtitle: 'Cumprimento de missões diárias, disciplina e uso responsável dos recursos.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            No AgroInvest, o dinheiro não surge do nada. Ele é fruto do <strong>trabalho diário</strong>, do planejamento e do cumprimento de metas agrícolas e financeiras.
          </p>

          <div className="space-y-2.5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">1</span>
              <div>
                <strong className="text-white block">Consulte a aba "Missões & Metas"</strong>
                <span>Identifique os desafios ativos do dia (ex: irrigar a lavoura, montar reserva de R$ 150, aplicar em CDB).</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">2</span>
              <div>
                <strong className="text-white block">Execute as ações exigidas</strong>
                <span>Cada ação no campo consome energia diária (⚡). Planeje o dia para não ficar sem energia antes de cuidar dos canteiros críticos.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">3</span>
              <div>
                <strong className="text-white block">Resgate a recompensa em moedas e XP</strong>
                <span>Ao cumprir a condição, clique em "Resgatar Recompensa" para creditar as moedas no seu caixa.</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-700/50 p-3.5 rounded-xl text-amber-200">
            <strong className="block text-amber-300 mb-1">⚠️ Aviso Educacional Importante</strong>
            <p>
              Todas as moedas e valores do AgroInvest são <strong>estritamente fictícios</strong>. Eles servem exclusivamente para simulação didática e não podem ser convertidos, sacados ou transferidos em dinheiro real.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Capítulo 3 — Como plantar e colher',
      icon: '🌱',
      subtitle: 'Ciclo biológico, manejo do solo e a regra de ouro da reserva de sementes.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Cada cultura agrícola possui características próprias de custo, tempo de maturação, consumo hídrico e tolerância a pragas:
          </p>

          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>Hortaliças:</strong> Ciclo ultrarrápido (2 dias). Excelente para gerar fluxo de caixa no início.</li>
            <li><strong>Milho:</strong> Ciclo médio (3 dias). Boa demanda para ração e indústria.</li>
            <li><strong>Feijão:</strong> Ciclo de 4 dias. Preço sensível ao clima nacional.</li>
            <li><strong>Soja & Trigo:</strong> Grãos de exportação com maior margem de lucro por saca.</li>
            <li><strong>Café Especial:</strong> Ciclo longo (6 dias) e alto valor agregado.</li>
          </ul>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800/60 space-y-2">
            <h4 className="font-bold text-emerald-400 font-display">
              Exemplo Numérico: A Divisão Sustentável da Safra
            </h4>
            <p className="text-xs text-slate-300">
              Imagine que você colheu <strong>18 sacas de milho</strong> no seu lote:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono space-y-1">
              <div className="flex justify-between text-blue-300">
                <span>1. Reserva Técnica (Replantio):</span>
                <span>3 sacas (guardadas no armazém)</span>
              </div>
              <div className="flex justify-between text-emerald-300">
                <span>2. Excedente Comercializável:</span>
                <span>15 sacas (vendidas a R$ 12,00)</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
                <span>Receita da Venda:</span>
                <span>R$ 180,00 de caixa</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              No próximo ciclo, você replantará o lote utilizando as 3 sacas reservadas, gastando <strong>R$ 0,00 de caixa</strong> com sementes!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Capítulo 4 — Como vender a produção',
      icon: '📦',
      subtitle: 'Comercialização no armazém, dinâmica de preços e a diferença entre receita e lucro.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            A comercialização ocorre na aba <strong>Armazém & Vendas</strong>. Os preços agrícolas oscilam diariamente com base na lei da oferta e da procura e em eventos climáticos.
          </p>

          <div className="space-y-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-white block mb-1">Como realizar a venda:</strong>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                <li>Acesse a aba <strong>Armazém & Vendas</strong>.</li>
                <li>Verifique a cotação do dia de cada produto.</li>
                <li>Utilize os botões <strong>Vender 25%</strong>, <strong>Vender 50%</strong> ou <strong>Vender Tudo</strong>.</li>
                <li>O sistema protege automaticamente suas sementes reservadas e vende apenas o excedente.</li>
              </ol>
            </div>
          </div>

          <div className="bg-blue-950/40 border border-blue-700/50 p-3.5 rounded-xl text-blue-200">
            <strong className="block text-blue-300 mb-1">Dica Financeira: Receita ≠ Lucro</strong>
            <p>
              Se você vendeu R$ 200 de grãos, essa é sua <strong>Receita Bruta</strong>. Para descobrir o <strong>Lucro Real</strong>, você deve subtrair os custos de adubação (R$ 15), eventuais tratamentos de pragas (R$ 25) e a manutenção diária da terra.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Capítulo 5 — Conhecendo os investimentos',
      icon: '🏛️',
      subtitle: 'Tesouro Direto, Renda Fixa privada, Ações da B3, FIIs e Criptoativos explicados.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            No <strong>Mercado Financeiro</strong> do AgroInvest, você tem acesso aos principais produtos do ecossistema de investimentos brasileiro:
          </p>

          <div className="space-y-2.5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 block">Tesouro Selic (Tesouro Direto)</strong>
              <span className="text-xs">Título público indexado à taxa Selic. Baixíssimo risco e liquidez diária sem perdas por marcação a mercado. Perfeito para Reserva de Emergência.</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-teal-400 block">CDB (Certificado de Depósito Bancário)</strong>
              <span className="text-xs">Empréstimo ao banco remunerado por percentual do CDI (ex: 110% do CDI). Protegido pelo FGC até R$ 250 mil por CPF.</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-amber-400 block">LCA & LCI (Crédito do Agro e Imobiliário)</strong>
              <span className="text-xs">Títulos que financiam o agronegócio e a habitação. <strong>100% Isentos de Imposto de Renda</strong> para pessoas físicas!</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-blue-400 block">Ações da B3 (Renda Variável)</strong>
              <span className="text-xs">Frações de grandes empresas brasileiras (AGRO3, PETR4, BANC4). Podem valorizar e pagar dividendos, mas os preços oscilam diariamente e não há rentabilidade garantida.</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-purple-400 block">Fundos Imobiliários & Fiagro (FIIs)</strong>
              <span className="text-xs">Fundos que investem em fazendas arrendadas e galpões logísticos. Pagam proventos mensais isentos de IR na conta corrente.</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-red-400 block">Criptoativos (Bitcoin / Ethereum)</strong>
              <span className="text-xs">Moedas descentralizadas de altíssima volatilidade. Podem subir muito ou cair bruscamente. Não possuem garantia do governo nem do FGC.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Capítulo 6 — Como realizar um investimento',
      icon: '💼',
      subtitle: 'Passo a passo prático para aplicar suas moedas na plataforma.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Investir no AgroInvest é simples e educativo. Siga o roteiro em 8 passos:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
            <li>Abra a aba <strong>Mercado Financeiro</strong>.</li>
            <li>Escolha a categoria desejada (Tesouro Direto, CDB, Ações, FIIs ou Cripto).</li>
            <li>Consulte a lâmina informativa do ativo: taxa, prazo, carência e risco.</li>
            <li>Clique no botão <strong>Investir</strong>.</li>
            <li>Informe o valor de moedas fictícias a aplicar (respeitando o mínimo do produto).</li>
            <li>Revise a operação e os alertas tributários.</li>
            <li>Confirme a compra. O valor sai do seu caixa e entra na sua carteira.</li>
            <li>Acompanhe o desempenho diário na aba <strong>Minha Carteira</strong>.</li>
          </ol>

          <div className="bg-amber-950/40 border border-amber-700/50 p-3 rounded-xl text-amber-200 text-xs">
            <strong>Lembre-se:</strong> O dinheiro investido deixa de estar imediatamente disponível para pagar custos da fazenda até que você decida resgatá-lo ou vendê-lo.
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Capítulo 7 — Como acompanhar rendimentos',
      icon: '📊',
      subtitle: 'Diferença entre valor bruto, tributação regressiva de IR, IOF e retorno líquido.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Na aba <strong>Minha Carteira</strong>, você pode auditar cada posição com total transparência fiscal:
          </p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Valor Aplicado (Principal):</span>
              <span className="text-white">R$ 1.000,00</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Valor Bruto Atual:</span>
              <span className="text-white">R$ 1.100,00 (+10%)</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>(-) IOF Regressivo (&lt; 30 dias):</span>
              <span>-R$ 0,00 (após 30 dias)</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>(-) Imposto de Renda (ex: 22,5% sobre o lucro):</span>
              <span>-R$ 22,50</span>
            </div>
            <div className="flex justify-between text-emerald-300 font-bold pt-1 border-t border-slate-800">
              <span>(=) Valor Líquido no Resgate:</span>
              <span>R$ 1.077,50</span>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            A tabela regressiva de Renda Fixa brasileira premia a paciência: quem mantém a aplicação por mais de 720 dias paga apenas <strong>15% de IR</strong> sobre o rendimento!
          </p>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Capítulo 8 — Reserva de emergência',
      icon: '🛡️',
      subtitle: 'O colchão de segurança contra imprevistos climáticos e operacionais.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Na agricultura real e nas finanças pessoais, imprevistos acontecem: secas repentinas, pragas na lavoura, necessidade urgente de adubo ou quebra de maquinário.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/50 space-y-2">
            <strong className="text-blue-400 block font-display">Para que serve a Reserva:</strong>
            <p className="text-xs text-slate-300">
              Garantir que você nunca precise vender suas ações na baixa por desespero ou contrair empréstimos com juros abusivos para salvar sua plantação.
            </p>
            <strong className="text-white block pt-1 text-xs">Onde aplicar a reserva?</strong>
            <p className="text-xs text-slate-300">
              Estritamente em ativos com <strong>liquidez diária e baixo risco</strong>, como <strong>Tesouro Selic</strong> ou <strong>CDB com liquidez diária (110% do CDI)</strong>.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Capítulo 9 — Diversificação e riscos',
      icon: '🧺',
      subtitle: 'Nunca coloque todos os ovos na mesma cesta.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            A diversificação é a única estratégia comprovada para suavizar as oscilações do patrimônio sem abrir mão de boas oportunidades de crescimento:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-red-900/40">
              <strong className="text-red-400 block text-xs mb-1">❌ Carteira Concentrada</strong>
              <span className="text-[11px] text-slate-400">100% em Bitcoin ou em uma única ação. Se o ativo cair 40%, seu patrimônio desaba junto e a fazenda entra em crise.</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/40">
              <strong className="text-emerald-400 block text-xs mb-1">✅ Carteira Diversificada</strong>
              <span className="text-[11px] text-slate-400">50% Renda Fixa segura + 25% Ações/FIIs + 15% Reserva + 10% Oportunidades. A fazenda continua sólida mesmo em dias de crise na bolsa.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'Capítulo 10 — Entendendo seu patrimônio',
      icon: '💎',
      subtitle: 'A fórmula matemática da riqueza e a verdade sobre transferências entre contas.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            O objetivo final do AgroInvest é fazer você compreender como a riqueza real é construída ao longo do tempo.
          </p>

          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-600/50 space-y-2">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
              Fórmula Oficial do Patrimônio Líquido:
            </span>
            <div className="text-sm sm:text-base font-black text-white font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
              Patrimônio Líquido = Caixa + Reserva + Investimentos + Bens da Fazenda − Dívidas
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <strong className="text-amber-300 block">Exemplo Numérico Prático:</strong>
            <p className="text-slate-300">
              Se você tem <strong>R$ 500 no caixa</strong> e transfere R$ 200 para um CDB, seu caixa fica com R$ 300 e seus investimentos ficam com R$ 200.
            </p>
            <p className="text-emerald-300 font-bold">
              Seu patrimônio continua sendo exatamente os mesmos R$ 500! A transferência entre contas não é lucro.
            </p>
            <p className="text-slate-400 text-[11px]">
              O patrimônio só aumenta quando a fazenda produz lucro real ou quando os investimentos rendem juros compostos com o passar dos dias.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const current = chapters.find((c) => c.id === activeChapter) || chapters[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-4xl w-full shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Topo do Manual */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Manual Interativo do Jogador
              </h2>
              <span className="text-xs text-slate-400">
                Guia completo de agricultura e educação financeira do AgroInvest
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

        {/* Barra de Progresso de Leitura */}
        <div className="bg-slate-950 px-5 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Progresso de Leitura:</span>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className="font-bold font-mono text-emerald-300">{readingProgress}%</span>
          </div>
        </div>

        {/* Corpo com Navegação Lateral e Conteúdo */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navegação por Capítulos */}
          <div className="w-full md:w-64 bg-slate-950/90 border-r border-slate-800/80 p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-2 block mb-2">
              Capítulos
            </span>
            {chapters.map((ch) => {
              const isActive = ch.id === activeChapter;
              const isRead = readChapters.includes(ch.id);

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(ch.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{ch.icon}</span>
                    <span className="truncate">{ch.title.split('—')[1] || ch.title}</span>
                  </div>
                  {isRead && !isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Conteúdo do Capítulo Ativo */}
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span>{current.icon}</span>
                <span>{current.title.split('—')[0]}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display mt-1">
                {current.title.split('—')[1] || current.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {current.subtitle}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              {current.content}
            </div>
          </div>
        </div>

        {/* Rodapé com Navegação Anterior / Próximo */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={activeChapter === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
          >
            Voltar ao Jogo
          </button>

          <button
            onClick={handleNext}
            disabled={activeChapter === 10}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white shadow-md cursor-pointer"
          >
            <span>Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
