import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { userStore } from "../store/userStore";

export interface ChatProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  unit_value: number;
  stock: number;
  category: string;
  score: number;
}

export interface ChatResponse {
  conversationId: string;
  reply: string;
  products: ChatProduct[];
}

export class ChatRequestError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ChatRequestError";
    this.status = status;
    this.code = code;
  }
}

export function useChat() {
  return useMutation({
    mutationFn: async (input: {
      message: string;
      conversationId?: string;
    }) => {
      const authToken = userStore.getState().user.token;
      if (!authToken) {
        throw new ChatRequestError(
          "Faça login para usar o chat.",
          401,
          "UNAUTHORIZED",
        );
      }

      try {
        const { data } = await axios.post<ChatResponse>(
          "http://localhost:3333/chat/v2",
          {
            message: input.message,
            conversationId: input.conversationId,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        return data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const data = err.response?.data as
            | { message?: string; code?: string }
            | undefined;
          const message =
            (typeof data?.message === "string" && data.message) ||
            (status === 429
              ? "Limite de uso do chat atingido. Tente mais tarde."
              : status === 401
                ? "Faça login para usar o chat."
                : "Falha ao falar com o chat.");
          throw new ChatRequestError(message, status, data?.code);
        }
        throw err;
      }
    },
  });
}
