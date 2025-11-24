import React, { useState, useRef, useEffect } from 'react';
import { IconMessage, IconX, IconSparkles } from './Icons';
import { chatWithAri } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Eu sou Ari, sua assistente virtual. Como posso ajudar com sua impressão 3D hoje?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInputText('');
    setLoading(true);

    const reply = await chatWithAri(userMsg);
    setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-cyber-dark/95 border border-cyber-primary/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-t-lg rounded-bl-lg backdrop-blur-md overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-cyber-primary/10 p-4 border-b border-cyber-primary/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyber-primary/20 flex items-center justify-center border border-cyber-primary">
                <IconSparkles className="w-4 h-4 text-cyber-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">ARI - Suporte IA</h3>
                <span className="flex items-center gap-1 text-[10px] text-cyber-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-pulse"/> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 text-sm font-sans relative ${
                    msg.sender === 'user' 
                    ? 'bg-cyber-primary/20 text-white clip-message-user border border-cyber-primary/30' 
                    : 'bg-white/5 text-gray-200 clip-message-bot border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded clip-message-bot w-16 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                  <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                  <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida..."
                className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-primary transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !inputText.trim()}
                className="bg-cyber-primary/20 hover:bg-cyber-primary/40 text-cyber-primary p-2 rounded border border-cyber-primary/50 transition-colors disabled:opacity-50"
              >
                <IconMessage className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-cyber-primary hover:bg-cyber-secondary text-cyber-black flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? <IconX className="w-6 h-6" /> : <IconMessage className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatBot;