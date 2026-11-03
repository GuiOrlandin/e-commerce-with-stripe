import { BaseMessage, ToolMessage } from '@langchain/core/messages';
import {
  ChatProductDto,
  parseSearchProductsToolResult,
} from './parseSearchProductsToolResult';

export function agentCalledSearchProducts(messages: BaseMessage[]): boolean {
  return messages.some(
    (msg) => ToolMessage.isInstance(msg) && msg.name === 'search_products',
  );
}

/** Last search_products tool payload wins (grounding source of truth). */
export function extractProductsFromAgentMessages(
  messages: BaseMessage[],
): ChatProductDto[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (ToolMessage.isInstance(msg) && msg.name === 'search_products') {
      return parseSearchProductsToolResult(String(msg.content));
    }
  }
  return [];
}

export function extractLastAiText(messages: BaseMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg._getType() === 'ai') {
      const content = msg.content;
      if (typeof content === 'string') return content;
      if (Array.isArray(content)) {
        return content
          .map((part) =>
            typeof part === 'string'
              ? part
              : part && typeof part === 'object' && 'text' in part
                ? String((part as { text: unknown }).text)
                : '',
          )
          .join('');
      }
    }
  }
  return '';
}
