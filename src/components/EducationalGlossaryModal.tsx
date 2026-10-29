import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, ShieldCheck, Scale, Landmark } from 'lucide-react';

interface GlossaryItem {
  term: string;
  category: 'renda_fixa' | 'tributos' | 'mercado' | 'agro';
  summary: string;
  fullExplanation: string;
  source: string;
}

const GLOSSARY_DATA: GlossaryItem[] = [
  {
    term: 'Taxa Selic (Sistema Especial de Liquidação e Custódia)',
    category: 'mercado',
    summary: 'Taxa básica de juros da economia brasileira, definida a cada 45 dias pelo Copom/Banco Central.',
    fullExplanation: 'A Selic é a referência para todas as demais taxas de juros no Brasil. Quando ela sobe, os rendimentos de títulos como o Tesouro Selic e CDBs aumentam, o crédito fica mais caro e a inflação tende a cair.',
    source: 'Banco Central do Brasil (BCB)',
  },
  {
    term: 'CDI (Certificado de Depósito Interbancário)',
    category: 'renda_fixa',
    summary: 'Taxa média dos empréstimos diários que os bancos fazem entre si para fechar o caixa no positivo.',
    fullExplanation: 'O CDI não é um produto que você compra no balcão, mas sim o principal indicador de referência (benchmark) da renda fixa privada (CDBs, LCIs, LCAs). Historicamente, acompanha muito de perto a taxa Selic efetiva (cerca de 0,10 ponto percentual abaixo da Selic Meta).',
    source: 'B3 — Brasil, Bolsa, Balcão',
  },
  {
    term: 'IPCA (Índice Nacional de Preços ao Consumidor Amplo)',
    category: 'mercado',
    summary: 'Medida oficial da inflação no Brasil calculada mensalmente pelo IBGE.',
    fullExplanation: 'Mostra a variação do custo de vida e dos preços de alimentos, combustível, habitação e serviços. Investir em títulos como o Tesouro IPCA+ garante que o seu patrimônio cresça acima da inflação, preservando o poder de compra da fazenda ao longo das décadas.',
    source: 'IBGE / Banco Central',
  },
  {
    term: 'FGC (Fundo Garantidor de Créditos)',
    category: 'renda_fixa',
    summary: 'Mecanismo de proteção que cobre até R$ 250 mil por CPF e instituição financeira em caso de falência.',
    fullExplanation: 'O FGC protege aplicações bancárias como CDB, LCI, LCA e Poupança (com teto global de R$ 1 milhão a cada período de 4 anos). Importante: Títulos públicos federais (Tesouro Direto) NÃO dependem do FGC porque contam com a garantia soberana do Governo Federal, considerada a mais segura do país.',
    source: 'Fundo Garantidor de Créditos',
  },
  {
    term: 'Marcação a Mercado (MTM)',
    category: 'renda_fixa',
    summary: 'Atualização diária do preço dos títulos de renda fixa prefixados e IPCA+ conforme as taxas de juros do dia.',
    fullExplanation: 'Se as taxas de juros de mercado sobem, os títulos antigos de prazo fixo sofrem desvalorização temporária se você quiser vender hoje. Se as taxas caem, os títulos se valorizam. Se você levar o título até o vencimento contratado, receberá exatamente 100% da rentabilidade prometida.',
    source: 'Tesouro Nacional / ANBIMA',
  },
  {
    term: 'Tabela Regressiva de IR (Renda Fixa)',
    category: 'tributos',
    summary: 'Alíquotas de Imposto de Renda que diminuem quanto mais tempo o dinheiro permanece investido.',
    fullExplanation: 'No Brasil: Até 180 dias: 22,5% sobre o rendimento | De 181 a 360 dias: 20,0% | De 361 a 720 dias: 17,5% | Acima de 720 dias: 15,0%. O imposto incide apenas sobre o ganho de capital (lucro), nunca sobre o principal investido.',
    source: 'Receita Federal do Brasil',
  },
  {
    term: 'IOF Regressivo (Imposto sobre Operações Financeiras)',
    category: 'tributos',
    summary: 'Imposto cobrado sobre os rendimentos de resgates realizados com menos de 30 dias de aplicação.',
    fullExplanation: 'Começa em 96% do rendimento no 1º dia e vai caindo diariamente até chegar a 0% no 30º dia. Foi criado para desestimular a especulação de curtíssimo prazo. Regra de ouro: aguarde 30 dias para não pagar IOF!',
    source: 'Receita Federal do Brasil',
  },
  {
    term: 'Isenção de IR: LCA, LCI e Fiagro',
    category: 'tributos',
    summary: 'Incentivos fiscais do governo brasileiro para fomentar os setores agropecuário e imobiliário.',
    fullExplanation: 'Pessoas físicas não pagam imposto de renda sobre os rendimentos de Letras de Crédito do Agronegócio (LCA), Letras Imobiliárias (LCI) e sobre os proventos mensais distribuídos por Fundos Imobiliários e Fiagros que atendem aos requisitos legais da CVM.',
    source: 'Legislação Tributária Federal / CVM',
  },
  {
    term: 'Reserva de Sementes & Sustentabilidade',
    category: 'agro',
    summary: 'Prática de separar parte da safra colhida para servir de semente ou muda para o próximo ciclo produtivo.',
    fullExplanation: 'Garante a segurança alimentar e operacional da propriedade sem depender exclusivamente de compras emergenciais no mercado aberto a preços desfavoráveis.',
    source: 'Embrapa / Ministério da Agricultura',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalGlossaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<string>('tudo');

  if (!isOpen) return null;

  const filtered = GLOSSARY_DATA.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullExplanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat === 'tudo' || item.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-display">
                  Glossário Financeiro & Agro Oficial
                </h3>
                <p className="text-xs text-slate-400">
                  Conceitos práticos fundamentados nas diretrizes da CVM, Banco Central e B3.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Busca e Filtros */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar termo (ex: Selic, IOF, FGC, Marcação a Mercado)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-xs">
              {[
                { id: 'tudo', label: 'Todos' },
                { id: 'renda_fixa', label: 'Renda Fixa' },
                { id: 'tributos', label: 'Impostos' },
                { id: 'mercado', label: 'Mercado' },
                { id: 'agro', label: 'Agronegócio' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCat(c.id)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
                    filterCat === c.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Termos */}
          <div className="space-y-3 pt-2">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-emerald-900/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm font-display">{item.term}</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {item.source}
                  </span>
                </div>

                <p className="text-xs font-semibold text-emerald-300/90 leading-snug">
                  {item.summary}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  {item.fullExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Fechar Glossário
          </button>
        </div>
      </div>
    </div>
  );
};
