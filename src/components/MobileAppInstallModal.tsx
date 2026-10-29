import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle,
  Apple,
  Share2,
  PlusSquare,
  Cpu,
  Terminal,
  Database,
  Cloud,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useGame } from '../context/GameContext';

interface MobileAppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppInstallModal: React.FC<MobileAppInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const { syncStatus, lastSyncedAt } = useGame();
  const [activeTab, setActiveTab] = useState<'celular' | 'apk_capacitor'>('celular');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden my-6">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 px-6 py-4 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-950 ring-2 ring-emerald-400/30">
              <Smartphone className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-lg font-display">
                  AgroInvest no Celular
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Android & iOS
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                Instale como aplicativo nativo ou gere o APK Android
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-850/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas Superiores */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('celular')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'celular'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instalar no Celular (PWA Nativo)</span>
          </button>
          <button
            onClick={() => setActiveTab('apk_capacitor')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'apk_capacitor'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Empacotamento APK & Capacitor</span>
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Informação sobre Armazenamento Local Seguro */}
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3.5">
            <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-200">
                <span>Armazenamento Interno do Aparelho & Nuvem</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Offline-First Ativo
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                O aplicativo salva automaticamente todo o seu saldo, canteiros da fazenda, sementes, colheitas, investimentos e histórico no armazenamento interno do seu aparelho. Ao reconectar à internet, ele sincroniza imediatamente com sua conta no Cloud Firestore.
              </p>
              <div className="pt-1 text-[11px] text-emerald-400/90 font-mono">
                Status atual: {syncStatus === 'synced' ? 'Sincronizado na Nuvem' : 'Armazenado no Cache Local Seguro'}
                {lastSyncedAt && ` • ${lastSyncedAt.toLocaleTimeString('pt-BR')}`}
              </div>
            </div>
          </div>

          {activeTab === 'celular' ? (
            <div className="space-y-5">
              {/* Se o app já estiver instalado em modo standalone */}
              {isInstalled ? (
                <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-xl p-5 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-white text-base">
                    AgroInvest já está instalado!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Você já está executando o aplicativo em tela cheia com ícone dedicado e suporte completo a modo offline.
                  </p>
                </div>
              ) : isInstallable ? (
                /* Botão de Instalação com 1 Toque para Android / Chrome */
                <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-4 text-center">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-base">
                      Instale o AgroInvest com 1 Toque
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Tenha o ícone do AgroInvest na tela de início do seu celular, carregamento instantâneo, tela cheia sem barras de navegador e modo offline.
                    </p>
                  </div>

                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-950 border border-emerald-400/40 transition transform active:scale-95 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Instalar Aplicativo no Celular</span>
                  </button>
                  {installSuccess && (
                    <p className="text-xs text-emerald-300 font-semibold">
                      Solicitação enviada! Verifique a tela de início do seu celular.
                    </p>
                  )}
                </div>
              ) : null}

              {/* Guia para iPhone / iOS Safari */}
              <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Apple className="w-4 h-4 text-slate-200" />
                  <span>Como instalar no iPhone (iOS Safari)</span>
                </div>
                <p className="text-xs text-slate-300">
                  No iOS, a Apple exige o uso do menu Compartilhar do Safari. É rápido e seguro:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 font-bold text-[11px]">
                      1
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Botão Compartilhar</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        No Safari do iPhone, toque no ícone de <strong className="text-slate-200">Compartilhar</strong> (quadrado com seta para cima na barra inferior).
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold text-[11px]">
                      2
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Tela de Início</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Role a lista para baixo e toque em <strong className="text-slate-200">Adicionar à Tela de Início</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guia para Android caso o prompt não abra direto */}
              <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Como instalar no Android (Google Chrome)</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <p>
                    1. Abra o menu do Chrome tocando nos <strong>três pontinhos verticais (⋮)</strong> no canto superior direito.
                  </p>
                  <p>
                    2. Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                  </p>
                  <p>
                    3. Confirme em <strong>"Instalar"</strong>. O aplicativo AgroInvest será baixado e ficará na sua gaveta de aplicativos com ícone próprio e inicialização instantânea!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Guia de Empacotamento Nativo com Capacitor & APK */
            <div className="space-y-4">
              <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Gerando o APK Nativo do Android via Capacitor</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O projeto já conta com o arquivo de configuração <code className="bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded font-mono">capacitor.config.ts</code> pronto com o identificador <code className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-mono">br.com.agroinvest.app</code>, splash screen personalizada e integração nativa.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-xs text-emerald-300">
                  <div className="text-slate-400"># 1. Compilar a aplicação web otimizada</div>
                  <div>npm run build</div>
                  <div className="text-slate-400 pt-1"># 2. Adicionar a plataforma Android (gera pasta /android)</div>
                  <div>npx cap add android</div>
                  <div className="text-slate-400 pt-1"># 3. Sincronizar os assets e plugins</div>
                  <div>npx cap sync</div>
                  <div className="text-slate-400 pt-1"># 4. Abrir no Android Studio para gerar o APK</div>
                  <div>npx cap open android</div>
                </div>
                <p className="text-xs text-slate-400">
                  No Android Studio: Acesse <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> para gerar seu arquivo <strong className="text-slate-200">app-debug.apk</strong> ou assinar a versão de produção.
                </p>
              </div>

              <div className="bg-slate-850 border border-slate-750 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Apple className="w-4 h-4 text-slate-200" />
                  <span>Preparando versão de testes para iOS (iPhone)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para gerar o projeto Xcode para testes em iPhones via TestFlight:
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-xs text-slate-200">
                  <div className="text-slate-400"># Adicionar a plataforma iOS (em ambiente macOS)</div>
                  <div className="text-blue-300">npx cap add ios</div>
                  <div className="text-blue-300">npx cap open ios</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com botão de fechar */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            AgroInvest App • Modo Standalone & Offline Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
