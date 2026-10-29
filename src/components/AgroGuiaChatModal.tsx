import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Trash2,
  Sparkles,
  ExternalLink,
  HelpCircle,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { askAgroGuia, ChatMessage } from '../services/agroGuiaService';
import { useGame } from '../context/GameContext';

interface AgroGuiaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_QUESTIONS = [
  'Como faço minha primeira colheita?',
  'Quanto devo reservar para replantar?',
  'Qual é a diferença entre CDI e CDB?',
  'Como funciona o Tesouro Selic?',
  'Por que minhas ações perderam valor?',
  'O que significa diversificar investimentos?',
  'Como posso aumentar o patrimônio da minha fazenda?',
];

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'assistant',
  text: 'Olá! Eu sou o AgroGuia, seu companheiro de aprendizado no AgroInvest. Posso ajudar com sua fazenda, suas missões e seus investimentos. Se precisar de informações atualizadas, também posso pesquisar fontes confiáveis na internet. O que você gostaria de aprender hoje?',
  timestamp: new Date(),
};

export const AgroGuiaChatModal: React.FC<AgroGuiaChatModalProps> = ({ isOpen, onClose }) => {
  const { state } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const answer = await askAgroGuia(text, state);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: answer.content,
        timestamp: new Date(),
        sources: answer.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Erro na resposta do AgroGuia:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Desculpe, tive um contratempo momentâneo ao processar a resposta. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[480px] sm:max-h-[640px] h-full sm:h-[85vh] z-50 flex flex-col bg-slate-900 border border-emerald-500/30 sm:rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 px-4 py-3.5 flex items-center justify-between border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/40">
            <Bot className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base font-display">AgroGuia</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Assistente Oficial
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-tight">
              Aprenda, planeje e cresça com inteligência.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            title="Limpar conversa"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-emerald-850/60 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Minimizar painel"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-emerald-850/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/70 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950'
                  : 'bg-slate-850 border border-slate-750 text-slate-100 rounded-bl-none shadow-md'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AgroGuia</span>
                </div>
              )}
              <div className="whitespace-pre-line space-y-2">{msg.text}</div>

              {/* Fontes consultadas com links externos verificados */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Fontes oficiais consultadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded-md transition"
                      >
                        <span>{src.source}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {/* Indicador de Digitação / Pesquisa */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-2xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>AgroGuia está pesquisando e elaborando a resposta...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões de Perguntas Rápidas */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Dúvidas frequentes para perguntar:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isTyping}
              className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário de Envio */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pergunte sobre plantio, Selic, CDB, ações..."
          disabled={isTyping}
          className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
