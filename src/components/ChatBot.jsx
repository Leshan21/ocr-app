import { useState, useRef, useEffect } from "react";

export function ChatBot({ text, chat }) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.messages]);

  const handleSend = () => {
    if (input.trim() && !chat.isLoading) {
      chat.sendMessage(input, text);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { id: "summarize", label: "📝 Summarize" },
    { id: "translate_en", label: "🇬🇧 To English" },
    { id: "translate_si", label: "🇱🇰 To Sinhala" },
    { id: "translate_ta", label: "🇮🇳 To Tamil" },
    { id: "fix_errors", label: "🔧 Fix Errors" },
    { id: "explain", label: "💡 Explain" },
    { id: "extract_info", label: "📋 Extract Info" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between bg-slate-900 px-4 py-3 text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-sm font-semibold sm:text-base">
          🤖 AI Chat Assistant
        </span>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            ● Connected
          </span>
          <button className="text-sm font-semibold text-slate-200">
            {isExpanded ? "Hide" : "Open"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 bg-slate-50 p-4">
          {/* Quick Actions */}
          {text && (
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quick Actions
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => chat.quickAction(action.id, text)}
                    disabled={chat.isLoading}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No text notice */}
          {!text && chat.messages.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-600">
              <span className="block text-2xl">📄</span>
              <p className="mt-1">
                Extract text from an image first to enable text-related
                features.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                You can still chat with the AI assistant!
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
            {chat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : msg.isError
                        ? "bg-rose-50 text-rose-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                  <div className="mt-1 text-[10px] opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {chat.isLoading && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm">
                  🤖
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                text ? "Ask about the extracted text..." : "Type a message..."
              }
              disabled={chat.isLoading}
              rows={1}
              className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chat.isLoading}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {chat.isLoading ? "..." : "Send"}
            </button>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end">
            <button
              onClick={chat.clearChat}
              disabled={chat.messages.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
