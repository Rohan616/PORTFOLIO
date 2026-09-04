import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Key, Check, Smile } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { cosmicAudio } from '../../audio/CosmicAudioEngine';
import { sendChatMessage } from '../../services/chatService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: 'gemini-api' | 'portfolio-knowledge-base';
}

interface PortfolioChatboxProps {
  theme: ThemeConfig;
}

export const PortfolioChatbox: React.FC<PortfolioChatboxProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('gemini_user_api_key') || '');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Yo! I'm Rohan's AI Twin 🤖 — 50% computer engineering logic, 50% caffeine, and 100% hyped on anime & Batman lore. Ask me anything about Rohan's projects, why he thinks he's the next Tony Stark, or what he's building at DSEU!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'portfolio-knowledge-base'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    "Why should I hire Rohan? 😎",
    "Is his Batman scanner real? 🦇",
    "What's his anime power level? ⚔️",
    "How does he survive DSEU? ☕",
    "Drop his contact coords 📡"
  ];

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('gemini_user_api_key', apiKeyInput.trim());
    } else {
      localStorage.removeItem('gemini_user_api_key');
    }
    setSavedKeySuccess(true);
    cosmicAudio.playUIBeep(true);
    setTimeout(() => {
      setSavedKeySuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    cosmicAudio.playUIBeep(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const userApiKey = localStorage.getItem('gemini_user_api_key') || undefined;
    const response = await sendChatMessage(text, userApiKey);

    setIsTyping(false);
    cosmicAudio.playUIBeep();

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: response.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: response.source
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            cosmicAudio.playUIBeep();
            setIsOpen(true);
          }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full font-mono text-[11px] sm:text-xs font-bold text-black shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${theme.diskColor1}, ${theme.accentColor})`,
            boxShadow: `0 0 25px ${theme.accentColor}55`,
          }}
          title="Talk with Rohan's AI Twin"
        >
          <div className="relative">
            <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black text-black" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <span className="truncate">TALK TO ROHAN'S AI</span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 w-auto sm:w-[410px] h-[75vh] sm:h-[560px] max-h-[85vh] flex flex-col rounded-2xl glass-panel-glow border border-white/20 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{
            borderColor: `${theme.accentColor}55`,
            boxShadow: `0 10px 40px -10px rgba(0,0,0,0.8), 0 0 30px -5px ${theme.accentColor}33`,
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-white/10 flex-shrink-0"
            style={{
              background: `linear-gradient(to right, rgba(15,23,42,0.92), rgba(5,10,20,0.96))`
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center border border-white/20"
                style={{ backgroundColor: `${theme.accentColor}22` }}
              >
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.accentColor }} />
              </div>
              <div>
                <h3 className="font-mono text-[11px] sm:text-xs font-bold text-white flex items-center gap-1.5">
                  <span>ROHAN'S DIGITAL TWIN</span>
                  <span className="text-[9px] px-1 py-0.1 rounded bg-amber-400/20 text-amber-300 font-normal">Witty ⚡</span>
                </h3>
                <div className="font-mono text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span>Gemini 3.5 Flash + Lore</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  cosmicAudio.playUIBeep();
                  setShowSettings(!showSettings);
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  showSettings ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Gemini API Key Settings"
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  cosmicAudio.playUIBeep();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="p-3 bg-space-950/95 border-b border-white/10 space-y-2 animate-in fade-in flex-shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  <span>Custom Gemini Key (Optional)</span>
                </span>
                <span className="text-[9px] text-slate-500">Saved in browser</span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-space-900 border border-white/10 text-[11px] font-mono text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-[11px] font-bold transition-colors flex items-center gap-1"
                >
                  {savedKeySuccess ? <Check className="w-3 h-3" /> : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3 font-sans text-xs bg-space-950/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div 
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 border border-white/10"
                    style={{ backgroundColor: `${theme.accentColor}15` }}
                  >
                    <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: theme.accentColor }} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'text-black font-medium rounded-br-none shadow-md'
                      : 'bg-space-900/90 text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' ? theme.accentColor : undefined,
                  }}
                >
                  {msg.text}
                  
                  <div 
                    className={`text-[8px] sm:text-[9px] mt-1 font-mono flex items-center justify-between gap-2 ${
                      msg.sender === 'user' ? 'text-black/60' : 'text-slate-500'
                    }`}
                  >
                    {msg.source && (
                      <span className={`uppercase text-[8px] px-1 py-0.1 rounded border ${
                        msg.source === 'gemini-api'
                          ? 'bg-amber-400/10 border-amber-400/30 text-amber-300 font-semibold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}>
                        {msg.source === 'gemini-api' ? '⚡ Gemini 3.5' : '📄 Lore (Offline)'}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-slate-400 font-mono text-[10px] pl-6 sm:pl-8">
                <div className="flex gap-1 py-1 px-2 rounded-full bg-space-900 border border-white/10">
                  <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Synthesizing reply...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-2.5 py-1.5 bg-space-900/80 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2 py-0.8 rounded-full text-[9px] font-mono bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-2.5 sm:p-3 bg-space-950 border-t border-white/10 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about Rohan..."
              className="flex-1 px-3 py-2 rounded-xl bg-space-900 border border-white/10 focus:border-amber-400 focus:outline-none text-white text-xs font-mono placeholder-slate-500 transition-colors"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2 sm:p-2.5 rounded-xl text-black font-bold disabled:opacity-40 transition-transform active:scale-90"
              style={{
                background: `linear-gradient(135deg, ${theme.diskColor1}, ${theme.accentColor})`,
              }}
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
