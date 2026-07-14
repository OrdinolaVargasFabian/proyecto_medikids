import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "../../../services/api";

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-medi-400 to-medi-500 flex items-center justify-center shrink-0 shadow-sm">
    <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white">
      <rect x="5" y="9" width="14" height="10" rx="2" fill="currentColor" />
      <circle cx="9" cy="14" r="1.5" fill="white" />
      <circle cx="15" cy="14" r="1.5" fill="white" />
      <rect x="10" y="16" width="4" height="1.5" rx="0.75" fill="white" />
      <rect x="11" y="5" width="2" height="4" rx="1" fill="currentColor" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
      <rect x="3" y="12" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="19" y="12" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-2.5 mb-4">
    <BotAvatar />
    <div className="bg-medi-50 border border-medi-100 rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-medi-400"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  </div>
);

const formatMessage = (text) => {
  // Split by bold markdown pattern **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const ChatMessage = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-end gap-2.5 mb-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && <BotAvatar />}
      <div
        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${isUser
          ? "bg-gradient-to-br from-medi-400 to-medi-500 text-white rounded-2xl rounded-br-md shadow-sm"
          : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-md shadow-sm"
          }`}
      >
        {formatMessage(content)}
      </div>
    </motion.div>
  );
};

const WELCOME_MESSAGE = {
  role: "model",
  content:
    "¡Hola! 👋 Soy el asistente virtual de MediKids. Estoy aquí para ayudarte con información sobre nuestros servicios, especialidades, horarios, citas y más. ¿En qué puedo ayudarte hoy? 💚",
};

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path
      d="M5.694 12H12m-6.306 0L4.09 5.736a.6.6 0 0 1 .778-.737l15.247 5.585a.6.6 0 0 1 0 1.132L4.868 17.3a.6.6 0 0 1-.778-.736L5.694 12Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8">
    <path
      fill="currentColor"
      d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4.724l-4.762 2.857a1 1 0 0 1-1.508-.743L7 21v-2H6a4 4 0 0 1-3.995-3.8L2 15V7a4 4 0 0 1 4-4zm-2.8 9.286a1 1 0 0 0-1.414.014a2.5 2.5 0 0 1-3.572 0a1 1 0 0 0-1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0-.014-1.414M9.51 8H9.5a1 1 0 1 0 0 2h.01a1 1 0 0 0 0-2m5 0h-.01a1 1 0 0 0 0 2h.01a1 1 0 0 0 0-2" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const buildHistory = (msgs) => {
    const relevant = msgs.slice(-10);
    return relevant.map((m) => ({
      role: m.role === "model" ? "model" : "user",
      content: m.content,
    }));
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history = buildHistory(messages);
      const data = await sendChatMessage(text, history);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Lo siento, estoy teniendo dificultades para conectarme. Por favor intenta de nuevo o contáctanos directamente al 970 854 221. 📞",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        id="chatbot-fab"
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-medi-400 to-medi-500 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(184,202,118,0.5)] hover:shadow-[0_12px_40px_rgba(184,202,118,0.6)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat de asistencia"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-medi-400/30 pointer-events-none" />
        )}
      </motion.button>

      {/* ── Botón flotante de WhatsApp ── */}
      <a
        id="btn-whatsapp-flotante"
        href="https://wa.me/51970654221"
        target="_blank"
        rel="noopener noreferrer"
        title="Contactar por WhatsApp"
        className="fixed bottom-24 right-6 z-50 group"
        style={{ filter: "drop-shadow(0 4px 16px rgba(37,211,102,0.45))" }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: "rgba(37,211,102,0.35)" }}
        />
        <span
          className="relative flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-8" fill="white">
            <path d="M24 4C12.95 4 4 12.95 4 24c0 3.55.93 6.87 2.55 9.76L4 44l10.5-2.5A19.87 19.87 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4Zm0 36a15.93 15.93 0 0 1-8.19-2.26l-.59-.35-6.23 1.49 1.56-5.97-.39-.62A15.94 15.94 0 0 1 8 24c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16Zm8.75-11.71c-.48-.24-2.83-1.4-3.27-1.56-.44-.16-.76-.24-1.08.24-.32.48-1.24 1.56-1.52 1.88-.28.32-.56.36-1.04.12-.48-.24-2.03-.75-3.87-2.38-1.43-1.27-2.39-2.84-2.67-3.32-.28-.48-.03-.74.21-.98.22-.22.48-.56.72-.84.24-.28.32-.48.48-.8.16-.32.08-.6-.04-.84-.12-.24-1.08-2.6-1.48-3.56-.39-.93-.79-.8-1.08-.82h-.92c-.32 0-.84.12-1.28.6-.44.48-1.68 1.64-1.68 4s1.72 4.64 1.96 4.96c.24.32 3.38 5.16 8.2 7.24 1.15.5 2.04.8 2.74 1.02 1.15.36 2.2.31 3.03.19.92-.14 2.83-1.16 3.23-2.28.4-1.12.4-2.08.28-2.28-.12-.2-.44-.32-.92-.56Z" />
          </svg>
        </span>
      </a>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden
                       max-[480px]:bottom-0 max-[480px]:right-0 max-[480px]:w-full max-[480px]:h-full max-[480px]:max-w-full max-[480px]:max-h-full max-[480px]:rounded-none"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-medi-400 via-medi-500 to-medi-500 px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                    <rect x="5" y="9" width="14" height="10" rx="2" fill="currentColor" />
                    <circle cx="9" cy="14" r="1.5" fill="rgba(0,0,0,0.3)" />
                    <circle cx="15" cy="14" r="1.5" fill="rgba(0,0,0,0.3)" />
                    <rect x="10" y="16" width="4" height="1.5" rx="0.75" fill="rgba(0,0,0,0.3)" />
                    <rect x="11" y="5" width="2" height="4" rx="1" fill="currentColor" />
                    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                    <rect x="3" y="12" width="2" height="4" rx="1" fill="currentColor" />
                    <rect x="19" y="12" width="2" height="4" rx="1" fill="currentColor" />
                  </svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-medi-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm leading-tight">Asistente MediKids</h3>
                <p className="text-white/80 text-xs font-medium">En línea — Responde al instante</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 hidden max-[480px]:flex cursor-pointer"
                aria-label="Cerrar chat"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth bg-slate-100"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#dae1c0 transparent",
                overscrollBehavior: "contain",
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  isLatest={i === messages.length - 1}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 focus-within:border-medi-400 focus-within:ring-2 focus-within:ring-medi-100 transition-all duration-200 px-3 py-1.5">
                <input
                  ref={inputRef}
                  id="chatbot-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none py-1.5 disabled:opacity-50 font-medium"
                  autoComplete="off"
                />
                <button
                  type="button"
                  id="chatbot-send"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-medi-400 to-medi-500 text-white flex items-center justify-center hover:from-medi-500 hover:to-medi-600 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                  aria-label="Enviar mensaje"
                >
                  <SendIcon />
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
                Asistente IA de MediKids · Solo consultas de la clínica
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
