import { User } from "lucide-react";
import socket from "../../services/socket";


import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import { useParams } from "react-router-dom";

const SYSTEM_PROMPT = `You are a helpful assistant for an event ticketing website. 
Help users find events, buy tickets, check seat availability, understand refund policies, 
navigate the site, and answer any event-related questions. 
Keep answers concise, friendly, and focused on event ticketing topics.
If asked about something unrelated to events or tickets, gently redirect them.`;

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const {lang}=useParams();
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 gap-2`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full shrink-0 mr-2 flex items-center justify-center text-white text-sm font-bold"
          style={{ background: "linear-gradient(135deg, #BB52E0, #FF49B5)" }}
        >
          <img
            src={import.meta.env.BASE_URL + "FLogo.png"}
            alt="fa3liat Logo"
            className="w-fit h-fit lx:absolute p-1 top-2 left-10 drop-shadow-black  drop-shadow-lg"
          />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser ? `text-white ${lang=="en"?"rounded-br-sm":"rounded-bl-sm"} bg-slate-600` : `text-gray-100 ${lang=="ar"?"rounded-br-sm":"rounded-bl-sm"} bg-primary`
        }`}
        
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full shrink-0 ml-2 flex items-center justify-center text-white text-sm bg-slate-600">
          <User />  
        </div>
      )}
    </div>
  );
}

export default function ChatbotHelper() {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: t("chatbot.welcomeMessage"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
  
    socket.on("chatbot-reply", (data) => {

      if(!data?.message) return ;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || t("chatbot.fallbackReply"),
        },
      ]);
      setLoading(false);
      inputRef.current?.focus();
    });

    return () => {
      socket.off("chatbot-reply");
    };
  }, [t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage() {
    const userText = input.trim();
    if (!userText || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    socket.emit("chatbot-message", { message: userText });
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <Title>{t("chatbot.title")}</Title>
      <div className="w-full max-w-2xl mb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-primary/90 text-xl shadow-lg bg-linear-to-br from-primary/60 to-secandry/60">
          <img
            src={import.meta.env.BASE_URL + "FLogo.png"}
            alt="fa3liat Logo"
            className="w-fit h-fit lx:absolute p-1 top-2 left-10 drop-shadow-black  drop-shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">
            {t("chatbot.title")}
          </h1>
          <p className="text-xs" style={{ color: "#BB52E0" }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1 mb-0.5" />
            {t("chatbot.status")}
          </p>
        </div>
      </div>

      {/* Chat Box */}
      <div
        className="w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(187,82,224,0.25)",
          backdropFilter: "blur(16px)",
          height: "520px",
        }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-2 space-y-1 bg-primary/10">
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start mb-3">
              <div
                className="w-8 h-8 rounded-full shrink-0 mr-2 flex items-center justify-center text-white text-sm"
                style={{
                  background: "linear-gradient(135deg, #BB52E0, #FF49B5)",
                }}
              >
                <img
                  src={import.meta.env.BASE_URL + "FLogo.png"}
                  alt="fa3liat Logo"
                  className="w-fit h-fit lx:absolute p-1 top-2 left-10 drop-shadow-black  drop-shadow-lg"
                />
              </div>
              <div
                className="rounded-2xl rounded-bl-sm"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(187,82,224,0.2)",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(187,82,224,0.2)" }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t("chatbot.inputPlaceholder")}
            disabled={loading}
            className="flex-1 bg-transparent  placeholder-gray-500 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
            style={{ background: "linear-gradient(135deg, #BB52E0, #FF49B5)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
