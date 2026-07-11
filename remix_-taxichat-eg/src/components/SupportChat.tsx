import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, ShieldCheck, PhoneCall, Check, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: Date;
}

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('taxi_ge_support_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        console.error('Error parsing support chat', e);
      }
    }
    return [
      {
        id: 'welcome',
        sender: 'support',
        text: '¡Hola! Bienvenido al Soporte Técnico y Central de Despacho de Taxi ExpressEG 🚖. ¿En qué podemos ayudarte en Malabo, Bata o el resto de Guinea Ecuatorial?',
        timestamp: new Date()
      }
    ];
  });
  
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem('taxi_ge_support_chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Automatically scroll down when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate real-time support responses after 1.5 seconds
    setTimeout(() => {
      let replyText = 'Entendido. He transmitido tu mensaje a nuestra central de control en Guinea Ecuatorial. Un operador se pondrá en contacto contigo en breve o te escribiremos al número proporcionado.';
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('tarifa') || lowerText.includes('precio') || lowerText.includes('pagar') || lowerText.includes('fcfa')) {
        replyText = 'Las tarifas estimadas de Taxi ExpressEG son de 500 a 1,000 FCFA para carreras estándar urbanas y de 1,500 a 2,500 FCFA para servicios especiales o urgentes en Malabo y Bata. Si un taxista te cobra de más, por favor repórtalo aquí con su número de matrícula.';
      } else if (lowerText.includes('conductor') || lowerText.includes('taxista') || lowerText.includes('registrar') || lowerText.includes('trabajar')) {
        replyText = '¡Excelente! Para registrarte como taxista verificado en Taxi ExpressEG, ve al perfil de taxista haciendo clic en "Taxista 🚖" arriba, ingresa tus datos personales y sube fotos legibles de tu DIP y Licencia en la pestaña de Verificación de Documentos.';
      } else if (lowerText.includes('whatsapp') || lowerText.includes('contacto') || lowerText.includes('llamar')) {
        replyText = 'Nuestra plataforma enlaza directamente con los conductores vía WhatsApp. Si tienes problemas para abrir los chats de WhatsApp, asegúrate de tener la app instalada o contáctanos directamente a los números de despacho: +240 222 123 456.';
      } else if (lowerText.includes('documento') || lowerText.includes('identidad') || lowerText.includes('dip') || lowerText.includes('licencia')) {
        replyText = 'La validación de documentos es procesada de forma segura por el equipo de control de Taxi ExpressEG. El tiempo medio de verificación con el Ministerio es de solo unos minutos después de que subas tus fotos.';
      } else if (lowerText.includes('hola') || lowerText.includes('buenas') || lowerText.includes('saludos')) {
        replyText = '¡Hola! Soy tu asistente de Soporte de Taxi ExpressEG Guinea Ecuatorial. ¿Necesitas ayuda con una carrera, tarifas, registro de conductor o reporte de seguridad?';
      }

      const supportMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'support',
        text: replyText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    '¿Cuáles son las tarifas estimadas en FCFA?',
    '¿Cómo me registro como taxista?',
    'Problemas para abrir WhatsApp',
    'Reportar objeto perdido o queja de taxista'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans" id="support-chat-wrapper">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer border border-emerald-500/20"
          id="floating-support-chat-btn"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out font-bold text-xs whitespace-nowrap block">
            Chat de Soporte
          </span>
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-sky-400 rounded-full border-2 border-slate-50 flex items-center justify-center text-[8px] font-black animate-pulse" />
        </button>
      )}

      {/* Floating Chat Drawer Container */}
      {isOpen && (
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-slate-150 w-[350px] sm:w-[380px] max-w-[calc(100vw-32px)] h-[480px] flex flex-col overflow-hidden animate-fade-in"
          id="support-chat-drawer"
        >
          {/* Header */}
          <div className="bg-slate-900 text-slate-100 p-4 border-b border-slate-800 flex items-center justify-between" id="chat-header">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-slate-900" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white tracking-wider uppercase">Soporte Central Taxi ExpressEG</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-bold">En línea 🟢</span>
                  <span className="text-[9px] text-slate-400 font-medium">• Malabo & Bata</span>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
              id="close-support-chat-btn"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50" id="chat-messages-body">
            {messages.map((msg) => {
              const isSupport = msg.sender === 'support';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 ${isSupport ? 'justify-start' : 'justify-end'}`}
                >
                  {isSupport && (
                    <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg h-7 w-7 flex items-center justify-center shrink-0 text-xs font-bold">
                      GE
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isSupport 
                        ? 'bg-white text-slate-850 border border-slate-200/60 shadow-xs' 
                        : 'bg-emerald-600 text-white shadow-xs font-medium'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 block px-1 text-right">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Simulated typing indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-slate-400 text-xs animate-pulse">
                <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg h-7 w-7 flex items-center justify-center shrink-0 text-xs font-bold">
                  GE
                </div>
                <div className="bg-white border border-slate-200/60 p-2.5 rounded-2xl flex items-center gap-1 text-[11px]">
                  <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                  <span>Soporte está redactando...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions suggestion box */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none" id="quick-questions-box">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="inline-block bg-white hover:bg-slate-100 text-slate-700 text-[10.5px] font-bold py-1 px-2.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field actions */}
          <div className="p-3 bg-white border-t border-slate-150 flex gap-2" id="chat-input-row">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputText);
                }
              }}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
              id="chat-text-input"
            />
            <button
              type="button"
              onClick={() => handleSendMessage(inputText)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              id="chat-send-btn"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
