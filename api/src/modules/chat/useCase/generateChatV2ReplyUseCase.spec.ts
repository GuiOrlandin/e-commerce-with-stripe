import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { GenerateChatV2ReplyUseCase } from './generateChatV2ReplyUseCase';
import { ChatProductDto } from './parseSearchProductsToolResult';

describe('GenerateChatV2ReplyUseCase', () => {
  const product: ChatProductDto = {
    id: 'p1',
    name: 'Tênis vermelho',
    description: null,
    image_url: '/files/tenis.jpg',
    unit_value: 199,
    stock: 2,
    category: 'calcado',
    score: 0.88,
  };

  it('returns products only from search_products tool output (grounding)', async () => {
    const invoke = jest.fn().mockResolvedValue({
      messages: [
        new HumanMessage('quero tênis vermelho'),
        new AIMessage({
          content: '',
          tool_calls: [
            {
              id: 'call-1',
              name: 'search_products',
              args: { message: 'tênis vermelho' },
            },
          ],
        }),
        new ToolMessage({
          tool_call_id: 'call-1',
          name: 'search_products',
          content: JSON.stringify({ products: [product] }),
        }),
        new AIMessage(
          'Recomendo o Tênis vermelho por R$ 199. Também tenho um produto inventado XYZ.',
        ),
      ],
    });

    const useCase = new GenerateChatV2ReplyUseCase(
      {
        invoke,
      } as never,
      {
        execute: jest.fn(),
      } as never,
      {
        chat: jest.fn(),
      } as never,
    );

    const result = await useCase.execute({
      message: 'quero tênis vermelho',
      conversationId: 'conv-1',
    });

    expect(result.conversationId).toBe('conv-1');
    expect(result.products).toEqual([product]);
    expect(result.reply).toContain('Tênis vermelho');
    expect(invoke).toHaveBeenCalled();
  });

  it('creates a conversationId when none is provided', async () => {
    const invoke = jest.fn().mockResolvedValue({
      messages: [new HumanMessage('oi'), new AIMessage('Olá!')],
    });

    const searchExecute = jest.fn().mockResolvedValue({
      candidates: [],
      matches: [],
    });
    const ollamaChat = jest
      .fn()
      .mockResolvedValue('Não encontrei um produto parecido na loja.');

    const useCase = new GenerateChatV2ReplyUseCase(
      { invoke } as never,
      { execute: searchExecute } as never,
      { chat: ollamaChat } as never,
    );

    const result = await useCase.execute({ message: 'oi' });

    expect(result.conversationId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(result.products).toEqual([]);
  });

  it('does not return search hits when the reply never names them', async () => {
    const invoke = jest.fn().mockResolvedValue({
      messages: [
        new HumanMessage('i was thinking to adopt a dog.'),
        new AIMessage({
          content: '',
          tool_calls: [
            {
              id: 'call-1',
              name: 'search_products',
              args: { message: 'adopt a dog' },
            },
          ],
        }),
        new ToolMessage({
          tool_call_id: 'call-1',
          name: 'search_products',
          content: JSON.stringify({ products: [product] }),
        }),
        new AIMessage(
          'Entendo o interesse em adotar, mas isso não está relacionado aos produtos da loja.',
        ),
      ],
    });

    const useCase = new GenerateChatV2ReplyUseCase(
      { invoke } as never,
      { execute: jest.fn() } as never,
      { chat: jest.fn() } as never,
    );

    const result = await useCase.execute({
      message: 'i was thinking to adopt a dog.',
      conversationId: 'conv-2',
    });

    expect(result.products).toEqual([]);
    expect(result.reply).toContain('não está relacionado');
  });
});
