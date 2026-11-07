import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatProduct } from "../hooks/useChat";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  products?: ChatProduct[];
};

interface ChatStore {
  conversationId?: string;
  messages: ChatMessage[];
  appendMessage: (message: ChatMessage) => void;
  setConversationId: (conversationId: string) => void;
  clearChat: () => void;
}

export const chatStore = create<ChatStore>()(
  persist(
    (set) => ({
      conversationId: undefined,
      messages: [],
      appendMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setConversationId: (conversationId) => set({ conversationId }),
      clearChat: () => set({ conversationId: undefined, messages: [] }),
    }),
    { name: "chat-storage" },
  ),
);
