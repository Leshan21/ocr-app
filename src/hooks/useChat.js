import { useState, useCallback } from "react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Chat hook for interacting with extracted text using AI
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Send message to AI
  const sendMessage = useCallback(
    async (userMessage, extractedText) => {
      if (!userMessage.trim()) return;
      if (!GROQ_API_KEY) {
        const errorMessage = {
          role: "assistant",
          content:
            "❌ Missing API key. Set VITE_GROQ_API_KEY in your .env file.",
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const newUserMessage = {
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        // Build context with extracted text
        const systemPrompt = extractedText
          ? `You are a helpful assistant. The user has extracted the following text from an image using OCR:

---
${extractedText}
---

Help the user with questions about this text. You can:
- Summarize the text
- Translate it to another language
- Answer questions about its content
- Fix OCR errors or formatting
- Extract specific information
- Explain the content

Be concise and helpful.`
          : `You are a helpful assistant. The user is using an OCR application. Help them with any questions they have.`;

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: "user", content: userMessage },
              ],
              max_tokens: 1000,
              temperature: 0.7,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error?.message || `API error: ${response.status}`,
          );
        }

        const data = await response.json();
        const assistantMessage = {
          role: "assistant",
          content: data.choices[0].message.content,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage = {
          role: "assistant",
          content: `❌ Error: ${error.message}. Please try again.`,
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  // Quick actions
  const quickAction = useCallback(
    (action, extractedText) => {
      const actions = {
        summarize: "Please summarize this text concisely.",
        translate_si: "Please translate this text to Sinhala (සිංහල).",
        translate_ta: "Please translate this text to Tamil (தமிழ்).",
        translate_en: "Please translate this text to English.",
        fix_errors:
          "Please fix any OCR errors and formatting issues in this text.",
        explain: "Please explain what this text is about in simple terms.",
        extract_info:
          "Please extract key information (names, dates, numbers, etc.) from this text.",
        questions: "What are the main points or questions this text addresses?",
        research_report:
          "Write a full research report based on this text with a target length of 6,000 to 7,200 words (roughly 20 to 24 pages in standard formatting). Include properly formatted references. Ensure the writing sounds humanized and student-friendly. Keep passive voice usage low and clearly point out any passive voice sentences with active-voice alternatives.",
      };

      const message = actions[action];
      if (message) {
        sendMessage(message, extractedText);
      }
    },
    [sendMessage],
  );

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    quickAction,
    hasApiKey: Boolean(GROQ_API_KEY),
  };
}
