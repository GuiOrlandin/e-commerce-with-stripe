import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

export function useChat() {
  return useMutation({
    mutationFn: async (input: {
      message: string;
      conversationId?: string;
    }) => {
      const { data } = await axios.post<ChatResponse>(
        "http://localhost:3333/chat/v2",
        {
          message: input.message,
          conversationId: input.conversationId,
        },
      );
      return data;
    },
  });
}
