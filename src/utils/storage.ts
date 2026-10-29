import { GameState } from '../types/game';
import { sanitizeGameState, hydrateGameState, INITIAL_GAME_STATE } from './gameStateSerializer';

const getKey = (userId?: string | null) => (userId ? `agroinvest_save_v2_${userId}` : 'agroinvest_save_v2');

export function saveGameStateToStorage(state: GameState, userId?: string | null): boolean {
  if (!userId) return false;
  try {
    const sanitized = sanitizeGameState(state);
    const serialized = JSON.stringify(sanitized);
    localStorage.setItem(getKey(userId), serialized);
    return true;
  } catch (err) {
    console.error('Erro ao salvar progresso localmente:', err);
    return false;
  }
}

export function loadGameStateFromStorage(userId?: string | null): GameState | null {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return hydrateGameState(parsed);
  } catch (err) {
    console.error('Erro ao carregar progresso do cache local:', err);
    return null;
  }
}

export function clearGameStateFromStorage(userId?: string | null): void {
  try {
    localStorage.removeItem(getKey(userId));
  } catch (err) {
    console.error('Erro ao limpar dados locais:', err);
  }
}

export function exportSaveToFile(state: GameState): void {
  const sanitized = sanitizeGameState(state);
  const json = JSON.stringify(sanitized, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agroinvest_save_dia${state.day}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
