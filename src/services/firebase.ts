import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GameState } from '../types/game';
import { sanitizeGameState, hydrateGameState } from '../utils/gameStateSerializer';

// Inicialização oficial do Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Teste de conexão seguro com o Firestore
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return false;
  }
}
testFirestoreConnection();

// Tipagem do perfil do jogador
export interface PlayerProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  tutorialCompleted: boolean;
  initialBonusGranted: boolean;
}

// Firestore operations para perfil
export async function fetchPlayerProfile(uid: string): Promise<PlayerProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as PlayerProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function savePlayerProfile(profile: PlayerProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Firestore operations para o progresso do jogo da fazenda
export async function fetchPlayerGameSave(uid: string): Promise<GameState | null> {
  if (!uid || typeof uid !== 'string') return null;
  const path = `games/${uid}`;
  try {
    // 1. Tenta carregar do documento principal games/{uid}
    const snap = await getDoc(doc(db, 'games', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data && (data.gameState || data.cashAvailable !== undefined)) {
        return hydrateGameState(data.gameState || data);
      }
    }

    // 2. Fallback: tenta carregar da subcoleção users/{uid}/gameState/current
    const subSnap = await getDoc(doc(db, 'users', uid, 'gameState', 'current'));
    if (subSnap.exists()) {
      const subData = subSnap.data();
      if (subData && (subData.gameState || subData.cashAvailable !== undefined)) {
        return hydrateGameState(subData.gameState || subData);
      }
    }

    return null;
  } catch (err) {
    console.warn(`[Firestore] Aviso na leitura de ${path}:`, err);
    // Permite que o chamador utilize o cache local resiliente sem crash
    return null;
  }
}

export async function savePlayerGameSave(uid: string, state: GameState): Promise<void> {
  if (!uid || typeof uid !== 'string') {
    throw new Error('UID de usuário inválido para persistência.');
  }

  const cleanState = sanitizeGameState(state);
  const path = `games/${uid}`;

  const payload = {
    userId: uid,
    day: cleanState.day,
    cashAvailable: cleanState.cashAvailable,
    emergencyReserve: cleanState.emergencyReserve,
    playerLevel: cleanState.playerLevel,
    updatedAt: new Date().toISOString(),
    gameState: cleanState,
  };

  try {
    // 1. Grava no caminho principal games/{uid}
    await setDoc(doc(db, 'games', uid), payload, { merge: true });

    // 2. Grava também no caminho organizado users/{uid}/gameState/current
    try {
      await setDoc(doc(db, 'users', uid, 'gameState', 'current'), payload, { merge: true });
    } catch {
      // Gravação secundária opcional não interrompe o fluxo principal
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
};
