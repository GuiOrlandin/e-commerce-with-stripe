import {
  AIMessage,
  BaseMessage,
  ToolMessage,
  UsageMetadata,
} from '@langchain/core/messages';
import {
  ChatProductDto,
  parseSearchProductsToolResult,
} from './parseSearchProductsToolResult';

/** Index of the latest user turn — memory may contain older tool calls. */
function lastHumanMessageIndex(messages: BaseMessage[]): number {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]._getType() === 'human') return i;
  }
  return 0;
}

export function agentCalledSearchProducts(messages: BaseMessage[]): boolean {
  const from = lastHumanMessageIndex(messages);
  return messages
    .slice(from)
    .some(
      (msg) => ToolMessage.isInstance(msg) && msg.name === 'search_products',
    );
}

/** One AIMessage per agent LLM call in the current turn. */
export function agentTurnLlmCalls(messages: BaseMessage[]): number {
  return messages
    .slice(lastHumanMessageIndex(messages))
    .filter((msg) => AIMessage.isInstance(msg)).length;
}

/** Real tokens (input + output) of every LLM call in the current turn; history resends included. */
export function agentTurnTokens(messages: BaseMessage[]): number {
  return messages
    .slice(lastHumanMessageIndex(messages))
    .reduce(
      (sum, msg) =>
        sum +
        (AIMessage.isInstance(msg)
          ? ((msg.usage_metadata as UsageMetadata | undefined)?.total_tokens ??
            0)
          : 0),
      0,
    );
}

/** Last search_products in the current turn wins (grounding source of truth). */
export function extractProductsFromAgentMessages(
  messages: BaseMessage[],
): ChatProductDto[] {
  const from = lastHumanMessageIndex(messages);
  for (let i = messages.length - 1; i >= from; i--) {
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
