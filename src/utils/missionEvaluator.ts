import { GameState, Mission } from '../types/game';
import { calculateNetWorth } from './financeEngine';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1_primeiro_plantio',
    title: 'Plantar e Cuidar da Lavoura',
    category: 'agricola',
    description: 'Plante uma cultura em um canteiro vazio e faça a irrigação.',
    educationalGoal: 'Compreender que toda colheita futura exige investimento de trabalho e recursos no presente.',
    completed: false,
    rewardCoins: 80,
    rewardXp: 40,
    isUnlocked: true,
    progress: 0,
  },
  {
    id: 'm2_reserva_emergencia',
    title: 'Construir sua Reserva de Emergência',
    category: 'reserva',
    description: 'Guarde pelo menos R$ 150 na Conta de Reserva ou em Tesouro Selic / CDB Diário.',
    educationalGoal: 'A Reserva de Emergência protege contra choques de safra e imprevistos sem precisar contrair dívidas caras.',
    completed: false,
    rewardCoins: 120,
    rewardXp: 60,
    isUnlocked: true,
    progress: 0,
  },
  {
    id: 'm3_sustentabilidade_sementes',
    title: 'Sustentabilidade: Reservar Sementes',
    category: 'agricola',
    description: 'Reserve a quantidade recomendada de sementes para garantir o próximo ciclo sem gastar seu caixa de giro.',
    educationalGoal: 'Negócios sustentáveis reinvertem parte dos frutos na própria operação antes de gastar todo o lucro.',
    completed: false,
    rewardCoins: 100,
    rewardXp: 50,
    isUnlocked: true,
    progress: 0,
  },
  {
    id: 'm4_primeiro_investimento_cdi',
    title: 'Entendendo a Renda Fixa Brasileira',
    category: 'renda_fixa',
    description: 'Faça uma aplicação em CDB do Banco Solidez (110% do CDI) ou LCA do Agronegócio.',
    educationalGoal: 'Aprender que o CDI é a taxa de referência dos empréstimos entre bancos no Brasil e baliza a renda fixa privada.',
    completed: false,
    rewardCoins: 150,
    rewardXp: 80,
    isUnlocked: true,
    progress: 0,
  },
  {
    id: 'm5_diversificacao',
    title: 'Diversificar o Portfólio',
    category: 'diversificacao',
    description: 'Tenha investimentos em pelo menos 2 categorias diferentes (ex: Renda Fixa + Ações ou FII).',
    educationalGoal: 'Não colocar todos os ovos na mesma cesta reduz a volatilidade do patrimônio total.',
    completed: false,
    rewardCoins: 200,
    rewardXp: 120,
    isUnlocked: true,
    progress: 0,
  },
  {
    id: 'm6_patrimonio_crescente',
    title: 'Rumo aos R$ 4.000 de Patrimônio',
    category: 'diversificacao',
    description: 'Atinja R$ 4.000 de patrimônio líquido somando caixa, reserva, investimentos e valor da fazenda.',
    educationalGoal: 'O patrimônio cresce pela união de trabalho produtivo, disciplina de poupança e efeito dos juros compostos ao longo do tempo.',
    completed: false,
    rewardCoins: 300,
    rewardXp: 150,
    isUnlocked: true,
    progress: 0,
  },
];

export const MISSION_CONDITIONS: Record<string, (state: GameState) => boolean> = {
  m1_primeiro_plantio: (s: GameState) =>
    s.plots.some((p) => p.crop !== null && p.waterLevel >= 70),

  m2_reserva_emergencia: (s: GameState) => {
    const selicPos = s.userPositions.filter(
      (p) => p.productId === 'tesouro_selic_2029' || p.productId === 'cdb_liquidez_110'
    );
    const investedInReserve = selicPos.reduce((sum, p) => sum + p.currentValue, 0);
    return s.emergencyReserve + investedInReserve >= 150;
  },

  m3_sustentabilidade_sementes: (s: GameState) =>
    Object.values(s.inventory).some((inv) => inv.reservedSeeds >= 3),

  m4_primeiro_investimento_cdi: (s: GameState) =>
    s.userPositions.some((p) => p.productId === 'cdb_liquidez_110' || p.productId === 'lca_agro_93'),

  m5_diversificacao: (s: GameState) => {
    const categories = new Set(
      s.userPositions
        .map((pos) => {
          const prod = s.investmentsCatalog.find((i) => i.id === pos.productId);
          return prod?.category;
        })
        .filter(Boolean)
    );
    return categories.size >= 2;
  },

  m6_patrimonio_crescente: (s: GameState) => {
    const nw = calculateNetWorth(s).netWorth;
    return nw >= 4000;
  },
};

export function evaluateMission(mission: Mission, state: GameState): boolean {
  if (mission.completed) return true;
  const condition = MISSION_CONDITIONS[mission.id] || mission.conditionCheck;
  if (!condition) return false;
  try {
    return condition(state);
  } catch (err) {
    console.error(`Erro ao verificar condição da missão ${mission.id}:`, err);
    return false;
  }
}

export function checkAllMissions(missions: Mission[], state: GameState): Mission[] {
  return missions.map((m) => {
    if (!m.completed && evaluateMission(m, state)) {
      return { ...m, completed: true, progress: 100 };
    }
    return m;
  });
}
