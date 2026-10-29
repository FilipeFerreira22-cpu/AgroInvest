export interface AgroGuiaSource {
  title: string;
  source: string;
  url: string;
}

export interface AgroGuiaAnswer {
  content: string;
  sources: AgroGuiaSource[];
}

export const OFFICIAL_SOURCES = {
  TESOURO: {
    title: 'Tesouro Direto — Como Funciona o Tesouro Selic e IPCA+',
    source: 'Tesouro Nacional / B3',
    url: 'https://www.tesourodireto.com.br',
  },
  BANCO_CENTRAL: {
    title: 'Banco Central do Brasil — Taxa Selic e Educação Financeira',
    source: 'Banco Central do Brasil (BCB)',
    url: 'https://www.bcb.gov.br',
  },
  CVM: {
    title: 'CVM Educacional — Portal de Educação Financeira do Investidor',
    source: 'Comissão de Valores Mobiliários (CVM)',
    url: 'https://www.gov.br/cvm/pt-br/assuntos/protecao-e-educacao-ao-investidor',
  },
  B3: {
    title: 'B3 — Educação Financeira, Renda Variável e FIIs',
    source: 'B3 — Brasil, Bolsa, Balcão',
    url: 'https://www.b3.com.br/pt_br/educacao/',
  },
  EMBRAPA: {
    title: 'Embrapa — Boas Práticas Agrícolas e Gestão de Lavoura',
    source: 'Empresa Brasileira de Pesquisa Agropecuária (Embrapa)',
    url: 'https://www.embrapa.br',
  },
};

export const AGRO_GUIA_KNOWLEDGE_BASE: Record<string, AgroGuiaAnswer> = {
  primeira_colheita: {
    content: `Para fazer sua primeira colheita com sucesso no AgroInvest:

1. **Acesse a aba 'Minha Fazenda'**: Escolha um dos canteiros disponíveis (comece pelo Milho ou Trigo, que são mais rápidos e baratos).
2. **Plante a semente**: Certifique-se de ter saldo em moedas e clique em 'Plantar'.
3. **Cuide do lote**: Regue e aplique fertilizante se desejar acelerar o crescimento e proteger o rendimento contra pragas.
4. **Passe o dia**: Clique no botão dourado **'Avançar Dia'** no topo para a cultura amadurecer.
5. **Colha e Venda**: Quando o estágio for 'Pronto para Colher', clique em 'Colher'. Depois vá para a aba **'Armazém & Vendas'** para vender sua colheita na melhor cotação do mercado!`,
    sources: [OFFICIAL_SOURCES.EMBRAPA],
  },
  reserva_replantio: {
    content: `A regra de ouro de todo agricultor e investidor sustentável: **Nunca gaste 100% da sua receita de colheita!**

- **Regra dos 30% a 50%**: Ao colher, reserve no mínimo 30% a 40% da quantidade como **sementes reservadas** ou guarde o valor em moedas equivalente para os próximos plantios.
- **Evite a insolvência agrícola**: Se você vender toda a sua safra e gastar todo o dinheiro comprando ativos ou arriscando sem guardar capital de giro, você não terá como plantar amanhã!
- **Dica AgroInvest**: No Armazém, use o botão **'Reservar Sementes'** para travar uma parte do estoque e garantir que sua terra nunca fique parada.`,
    sources: [OFFICIAL_SOURCES.EMBRAPA, OFFICIAL_SOURCES.CVM],
  },
  cdi_cdb: {
    content: `Essa é uma das dúvidas mais comuns no Brasil! Vamos desmistificar:

- **CDI (Certificado de Depósito Interbancário)**: É uma taxa de referência (benchmark) praticada entre os próprios bancos quando emprestam dinheiro uns aos outros por um dia. Ela segue muito de perto a taxa básica Selic (normalmente cerca de 0,10 ponto percentual abaixo da Selic).
- **CDB (Certificado de Depósito Bancário)**: É um produto real de investimento emitido por um banco para captar recursos de você. O banco paga uma rentabilidade combinada (exemplo: 100% do CDI, 110% do CDI ou uma taxa pré-fixada).

**Analogia simples**: O CDI é como o termômetro (a medida), e o CDB é a água quente (o produto que você experimenta). Os CDBs contam com a proteção do FGC (Fundo Garantidor de Créditos) até o limite de R$ 250 mil por CPF e instituição.`,
    sources: [OFFICIAL_SOURCES.BANCO_CENTRAL, OFFICIAL_SOURCES.CVM],
  },
  tesouro_selic: {
    content: `O **Tesouro Selic** é considerado o investimento com menor risco de crédito do mercado financeiro brasileiro:

- **O que é?**: É um título público emitido pelo Tesouro Nacional (o Governo Federal brasileiro).
- **Rentabilidade**: Rende diariamente acompanhando a taxa básica de juros da economia (a Taxa Selic Over).
- **Liquidez diária**: Você pode resgatar quando precisar sem risco de perda do valor principal se esperar o prazo padrão (D+1).
- **Para que serve?**: É o destino ideal para montar sua **Reserva de Emergência** e para objetivos de curto prazo.
- **No AgroInvest**: Sua 'Reserva de Emergência' no jogo simula o rendimento estável do Tesouro Selic, rendendo juros compostos a cada dia sem oscilações bruscas!`,
    sources: [OFFICIAL_SOURCES.TESOURO, OFFICIAL_SOURCES.BANCO_CENTRAL],
  },
  acoes_perderam_valor: {
    content: `Ver suas ações oscilarem para baixo pode assustar no começo, mas faz parte da dinâmica da **Renda Variável**:

1. **Preço vs. Valor**: O preço diário reflete o ânimo momentâneo do mercado (compradores vs. vendedores), notícias, taxas de juros e clima macroeconômico.
2. **Ciclos Econômicos**: Em ciclos de juros altos (Selic elevada), os investidores tendem a migrar para a renda fixa, o que pressiona o preço das ações para baixo.
3. **Horizonte de Tempo**: Renda variável é voltada para médio e longo prazo. Boas empresas e cooperativas continuam produzindo lucros e pagando dividendos mesmo em dias de cotação baixa.
4. **Gestão de Emoções**: Nunca invista em ações o dinheiro que você vai precisar para pagar as contas da lavoura no mês que vem!`,
    sources: [OFFICIAL_SOURCES.CVM, OFFICIAL_SOURCES.B3],
  },
  diversificar: {
    content: `**Diversificar** é a aplicação direta do ditado popular: *"Nunca coloque todos os ovos na mesma cesta!"*

Na prática do AgroInvest e da vida real:
- **Na agricultura**: Se você plantar apenas Soja e vier uma seca ou praga específica da soja, você perde tudo. Ao plantar Soja, Milho, Trigo e Café, o risco é diluído!
- **Nos investimentos**: Ter todo o seu dinheiro apenas em ações pode causar frio na barriga se o mercado cair. Uma carteira equilibrada possui:
  1. **Reserva de Emergência** (Tesouro Selic / Renda Fixa diária para segurança).
  2. **Títulos atrelados à inflação** (IPCA+ para preservar o poder de compra no futuro).
  3. **Renda Variável & FIIs/Fiagros** (ações e fundos do agro para crescimento e dividendos regulares).`,
    sources: [OFFICIAL_SOURCES.CVM, OFFICIAL_SOURCES.BANCO_CENTRAL],
  },
  aumentar_patrimonio: {
    content: `Para acelerar a construção do seu patrimônio no AgroInvest:

1. **Eficiência no Campo**: Mantenha os canteiros sempre com culturas plantadas, regadas e colhidas.
2. **Aproveite picos de preços**: Monitore as cotações no Armazém. Se o Café ou a Soja estiverem em alta, venda sua produção estocada.
3. **Aporte regular dos lucros**: Após colher e separar sementes, invista o excedente no Mercado Financeiro.
4. **O Poder dos Juros Compostos**: Reinvista os dividendos recebidos das empresas e fundos para comprar mais cotas.
5. **Conclua Missões**: As missões pagam bônus volumosos em moedas e pontos de experiência que aceleram seu progresso!`,
    sources: [OFFICIAL_SOURCES.CVM, OFFICIAL_SOURCES.TESOURO],
  },
};
