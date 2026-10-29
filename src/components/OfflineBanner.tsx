import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-amber-600/95 text-white px-4 py-2 rounded-full shadow-2xl border border-amber-400 text-xs font-semibold backdrop-blur-md animate-fade-in">
      <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
      <span>Modo Offline — Seu progresso está seguro no aparelho e será sincronizado ao reconectar.</span>
    </div>
  );
};
