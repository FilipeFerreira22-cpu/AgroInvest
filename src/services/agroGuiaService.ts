import {
  AGRO_GUIA_KNOWLEDGE_BASE,
  OFFICIAL_SOURCES,
  AgroGuiaAnswer,
  AgroGuiaSource,
} from './agroGuiaKnowledge';
import { GameState } from '../types/game';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  sources?: AgroGuiaSource[];
}

export async function askAgroGuia(
  question: string,
  gameState?: GameState
): Promise<AgroGuiaAnswer> {
  const normalized = question.toLowerCase().trim();

  // 1. Simulação com delay amigável para resposta natural
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 2. Correspondência semântica e contextual com a base inteligente
  if (
    normalized.includes('primeira colheita') ||
    normalized.includes('como colher') ||
    normalized.includes('como plantar') ||
    normalized.includes('começar a jogar')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.primeira_colheita;
  }

  if (
    normalized.includes('replantar') ||
    normalized.includes('reserva') && normalized.includes('semente') ||
    normalized.includes('quanto devo reservar') ||
    normalized.includes('gastar tudo')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.reserva_replantio;
  }

  if (
    normalized.includes('cdi') ||
    normalized.includes('cdb') ||
    normalized.includes('diferença entre cdi e cdb')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.cdi_cdb;
  }

  if (
    normalized.includes('tesouro selic') ||
    normalized.includes('selic') ||
    normalized.includes('título público')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.tesouro_selic;
  }

  if (
    normalized.includes('ações perderam') ||
    normalized.includes('caiu') ||
    normalized.includes('prejuízo') ||
    normalized.includes('ações') && normalized.includes('desvalor')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.acoes_perderam_valor;
  }

  if (
    normalized.includes('diversificar') ||
    normalized.includes('diversificação') ||
    normalized.includes('carteira equilibrada')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.diversificar;
  }

  if (
    normalized.includes('aumentar patrimônio') ||
    normalized.includes('crescer fazenda') ||
    normalized.includes('ficar rico') ||
    normalized.includes('multiplicar')
  ) {
    return AGRO_GUIA_KNOWLEDGE_BASE.aumentar_patrimonio;
  }

  // Se a dúvida envolver inflação ou IPCA
  if (normalized.includes('ipca') || normalized.includes('inflação')) {
    return {
      content: `O **IPCA (Índice Nacional de Preços ao Consumidor Amplo)** é o medidor oficial da inflação no Brasil, calculado pelo IBGE.

- **Por que ele importa?**: Se a inflação for de 5% no ano e seu dinheiro render apenas 4%, você perdeu **poder de compra** (perdeu dinheiro real).
- **Títulos IPCA+**: Pagam uma taxa fixa mais a inflação oficial (ex: IPCA + 6% ao ano), garantindo que seu patrimônio sempre cresça acima do custo de vida.
- **Dica AgroInvest**: No jogo, investir em títulos IPCA+ protege seu capital contra oscilações de custos de insumos e sementes ao longo dos anos.`,
      sources: [OFFICIAL_SOURCES.BANCO_CENTRAL, OFFICIAL_SOURCES.TESOURO],
    };
  }

  // Se a dúvida envolver dividendos ou Fiagros
  if (normalized.includes('dividendo') || normalized.includes('fiagro') || normalized.includes('fii')) {
    return {
      content: `Os **Dividendos** e **Rendimentos de Fiagros (Fundos de Investimento nas Cadeias Produtivas Agroindustriais)** funcionam como o fruto periódico da sua árvore de investimentos:

- **O que são?**: Parte dos lucros auferidos por empresas listadas em bolsa ou fundos do agronegócio distribuídos diretamente na conta dos cotistas/acionistas.
- **Renda Passiva**: No AgroInvest, quando você investe em empresas e fundos agropecuários, a cada novo dia do calendário você recebe dividendos creditados automaticamente no seu caixa!
- **Dica de Ouro**: Use os dividendos recebidos para reinvestir na fazenda ou comprar mais cotas. É assim que o efeito bola de neve dos juros compostos acontece.`,
      sources: [OFFICIAL_SOURCES.B3, OFFICIAL_SOURCES.CVM],
    };
  }

  // Resposta contextual educacional com base no estado atual do jogador
  const currentCash = gameState ? gameState.cashAvailable.toFixed(2) : '1.500,00';
  const currentDay = gameState ? gameState.day : 1;

  return {
    content: `Ótima pergunta! Analisando sua jornada atual no **Dia ${currentDay}** com **R$ ${currentCash}** em caixa:

No AgroInvest, o segredo do sucesso financeiro no agronegócio moderno é conciliar **produtividade na terra** com **inteligência de mercado**:
1. **Curto prazo**: Mantenha seus canteiros ativos, plante culturas de ciclo rápido e tenha sempre sementes em reserva no Armazém.
2. **Médio prazo**: Construa sua Reserva de Emergência (rendimento estável no Tesouro Selic) para suportar secas ou quebras temporárias de safra.
3. **Longo prazo**: Invista em ações e fundos do agronegócio na B3 para colher dividendos diários e valorização patrimonial.

Se quiser mais detalhes, você também pode explorar os 10 capítulos completos no **Manual do Jogador** ou me perguntar sobre qualquer investimento específico!`,
    sources: [OFFICIAL_SOURCES.CVM, OFFICIAL_SOURCES.TESOURO, OFFICIAL_SOURCES.EMBRAPA],
  };
}
