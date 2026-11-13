import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { trimHistory } from './langchainChatAgent.service';

describe('trimHistory', () => {
  const turn = (i: number) => [
    new HumanMessage(`pergunta ${i}`),
    new AIMessage({
      content: '',
      tool_calls: [{ id: `c${i}`, name: 'search_products', args: {} }],
    }),
    new ToolMessage({ tool_call_id: `c${i}`, content: '{}' }),
    new AIMessage(`resposta ${i}`),
  ];

  it('keeps at most N messages and starts on a human message', async () => {
    const history = [1, 2, 3, 4].flatMap(turn); // 16 messages
    const trimmed = await trimHistory(history, 6);

    expect(trimmed.length).toBeLessThanOrEqual(6);
    // Window of 6 would start on turn 3's ToolMessage; must skip to turn 4's human.
    expect(trimmed[0]).toBeInstanceOf(HumanMessage);
    expect(trimmed[0].content).toBe('pergunta 4');
    expect(trimmed[trimmed.length - 1].content).toBe('resposta 4');
  });

  it('returns history untouched when under the limit', async () => {
    const history = turn(1);
    expect(await trimHistory(history, 12)).toEqual(history);
  });
});
