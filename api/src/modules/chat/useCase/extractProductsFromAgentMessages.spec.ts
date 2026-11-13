import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import {
  agentTurnTokens,
  agentCalledSearchProducts,
  extractProductsFromAgentMessages,
} from './extractProductsFromAgentMessages';

const pug = {
  id: 'pug',
  name: 'PUG',
  description: null,
  image_url: '/files/pug.jpg',
  unit_value: 2000,
  stock: 1,
  category: 'pets',
  score: 0.8,
};

const iphone = {
  id: 'iphone',
  name: 'Iphone pro max 15',
  description: null,
  image_url: '/files/iphone.jpg',
  unit_value: 13000,
  stock: 4,
  category: 'eletronicos',
  score: 0.5,
};

describe('extractProductsFromAgentMessages (current turn)', () => {
  it('ignores search_products from previous turns in memory', () => {
    const messages = [
      new HumanMessage('quero um cachorro'),
      new AIMessage({
        content: '',
        tool_calls: [
          { id: 'c1', name: 'search_products', args: { message: 'cachorro' } },
        ],
      }),
      new ToolMessage({
        tool_call_id: 'c1',
        name: 'search_products',
        content: JSON.stringify({ products: [pug] }),
      }),
      new AIMessage('Encontrei o PUG.'),
      new HumanMessage('i was thinking to adopt a dog.'),
      new AIMessage(
        'Isso não está relacionado aos produtos disponíveis na loja.',
      ),
    ];

    expect(extractProductsFromAgentMessages(messages)).toEqual([]);
    expect(agentCalledSearchProducts(messages)).toBe(false);
  });

  it('uses search_products from the current turn only', () => {
    const messages = [
      new HumanMessage('quero um pug'),
      new ToolMessage({
        tool_call_id: 'old',
        name: 'search_products',
        content: JSON.stringify({ products: [pug] }),
      }),
      new HumanMessage('quero iphone'),
      new ToolMessage({
        tool_call_id: 'new',
        name: 'search_products',
        content: JSON.stringify({ products: [iphone] }),
      }),
      new AIMessage('Recomendo o Iphone pro max 15.'),
    ];

    expect(extractProductsFromAgentMessages(messages)).toEqual([iphone]);
    expect(agentCalledSearchProducts(messages)).toBe(true);
  });
});

describe('agentTurnTokens', () => {
  const ai = (total: number) =>
    new AIMessage({
      content: '',
      usage_metadata: {
        input_tokens: total - 1,
        output_tokens: 1,
        total_tokens: total,
      },
    });

  it('sums only the LLM calls of the current turn', () => {
    expect(
      agentTurnTokens([
        new HumanMessage('turno antigo'),
        ai(1000),
        new HumanMessage('turno atual'),
        ai(300),
        new ToolMessage({ content: '{}', tool_call_id: 't1' }),
        ai(450),
      ]),
    ).toBe(750);
  });
});
