import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  PlayerProfile,
  fetchPlayerProfile,
  savePlayerProfile,
} from '../services/firebase';

interface AuthContextType {
  user: User | null;
  profile: PlayerProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPasswordEmail: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  logout: () => Promise<void>;
  markTutorialCompleted: () => Promise<void>;
  resetTutorial: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapAuthErrorToPortuguese(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'O formato do e-mail inserido é inválido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado no AgroInvest. Tente entrar.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Utilize no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde alguns minutos ou redefina sua senha.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com a internet. Verifique sua rede e tente novamente.';
    case 'auth/operation-not-allowed':
      return 'Login por e-mail/senha não habilitado no console do Firebase. Você pode entrar usando a opção Google!';
    case 'auth/popup-closed-by-user':
      return 'Janela de autenticação fechada antes da conclusão.';
    default:
      return 'Ocorreu um erro durante a autenticação. Tente novamente.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          let prof = await fetchPlayerProfile(currentUser.uid);
          if (!prof) {
            // Se o perfil ainda não existe (ex: primeiro login com Google)
            prof = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Produtor Rural',
              createdAt: new Date().toISOString(),
              tutorialCompleted: false,
              initialBonusGranted: true,
            };
            await savePlayerProfile(prof);
          }
          setProfile(prof);
        } catch (err) {
          console.error('Erro ao buscar perfil do usuário:', err);
          // Fallback seguro em caso de indisponibilidade
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Produtor Rural',
            createdAt: new Date().toISOString(),
            tutorialCompleted: false,
            initialBonusGranted: true,
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      let prof = await fetchPlayerProfile(cred.user.uid);
      if (!prof) {
        prof = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || email.split('@')[0],
          createdAt: new Date().toISOString(),
          tutorialCompleted: false,
          initialBonusGranted: true,
        };
        await savePlayerProfile(prof);
      }
      setProfile(prof);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      return { success: false, error: mapAuthErrorToPortuguese(code) };
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const newProfile: PlayerProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: name.trim() || 'Produtor Rural',
        createdAt: new Date().toISOString(),
        tutorialCompleted: false,
        initialBonusGranted: true,
      };
      await savePlayerProfile(newProfile);
      setProfile(newProfile);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      return { success: false, error: mapAuthErrorToPortuguese(code) };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      let prof = await fetchPlayerProfile(cred.user.uid);
      if (!prof) {
        prof = {
          uid: cred.user.uid,
          email: cred.user.email || '',
          displayName: cred.user.displayName || 'Produtor Rural',
          createdAt: new Date().toISOString(),
          tutorialCompleted: false,
          initialBonusGranted: true,
        };
        await savePlayerProfile(prof);
      }
      setProfile(prof);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || '';
      return { success: false, error: mapAuthErrorToPortuguese(code) };
    }
  };

  const resetPasswordEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'Se este e-mail estiver cadastrado, as instruções para redefinição de senha foram enviadas. Verifique sua caixa de entrada e spam.',
      };
    } catch (err: any) {
      // Por segurança, resposta padronizada sem vazar enumeração de contas
      return {
        success: true,
        message: 'Se este e-mail estiver cadastrado, as instruções para redefinição de senha foram enviadas. Verifique sua caixa de entrada e spam.',
      };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const markTutorialCompleted = async () => {
    if (!profile) return;
    const updated = { ...profile, tutorialCompleted: true };
    setProfile(updated);
    await savePlayerProfile(updated);
  };

  const resetTutorial = async () => {
    if (!profile) return;
    const updated = { ...profile, tutorialCompleted: false };
    setProfile(updated);
    await savePlayerProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPasswordEmail,
        logout,
        markTutorialCompleted,
        resetTutorial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
