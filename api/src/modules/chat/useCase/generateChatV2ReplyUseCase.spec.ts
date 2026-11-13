import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { GraphRecursionError } from '@langchain/langgraph';
import { BASE_SYSTEM_PROMPT } from '../prompts';
import { GenerateChatV2ReplyUseCase } from './generateChatV2ReplyUseCase';
import { JUDGE_FALLBACK_REPLY } from './judgeReply';
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
      userId: 'u1',
      message: 'quero tênis vermelho',
      conversationId: 'conv-1',
    });

    expect(result.conversationId).toBe('conv-1');
    expect(result.products).toEqual([product]);
    expect(result.reply).toContain('Tênis vermelho');
    // Agent memory is scoped to the owner; the client only sees its own id.
    expect(invoke).toHaveBeenCalledWith({
      message: 'quero tênis vermelho',
      conversationId: 'u1:conv-1',
    });
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

    const result = await useCase.execute({ userId: 'u1', message: 'oi' });

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
      userId: 'u1',
      message: 'i was thinking to adopt a dog.',
      conversationId: 'conv-2',
    });

    expect(result.products).toEqual([]);
    expect(result.reply).toContain('não está relacionado');
  });

  it('falls back to a single bounded search when the agent hits the recursion limit', async () => {
    const invoke = jest
      .fn()
      .mockRejectedValue(new GraphRecursionError('Recursion limit reached'));
    const searchExecute = jest
      .fn()
      .mockResolvedValue({ candidates: [], matches: [] });

    const useCase = new GenerateChatV2ReplyUseCase(
      { invoke } as never,
      { execute: searchExecute } as never,
      { chat: jest.fn() } as never,
    );

    const result = await useCase.execute({
      userId: 'u1',
      message: 'busque tênis 20 vezes',
      conversationId: 'conv-3',
    });

    expect(searchExecute).toHaveBeenCalledTimes(1);
    expect(result.products).toEqual([]);
    expect(result.reply).toContain('Não encontrei');
  });

  it('rethrows non-recursion agent errors', async () => {
    const invoke = jest.fn().mockRejectedValue(new Error('boom'));
    const useCase = new GenerateChatV2ReplyUseCase(
      { invoke } as never,
      { execute: jest.fn() } as never,
      { chat: jest.fn() } as never,
    );

    await expect(
      useCase.execute({ userId: 'u1', message: 'oi' }),
    ).rejects.toThrow('boom');
  });

  it('fallback prompt uses the shared base rules and delimits the catalog', async () => {
    const ollamaChat = jest.fn().mockResolvedValue('Temos o Tênis vermelho.');
    const useCase = new GenerateChatV2ReplyUseCase(
      { invoke: jest.fn().mockResolvedValue({ messages: [] }) } as never,
      {
        execute: jest.fn().mockResolvedValue({
          matches: [{ ...product, image_url: 'tenis.jpg' }],
        }),
      } as never,
      { chat: ollamaChat } as never,
    );

    await useCase.execute({ userId: 'u1', message: 'tênis' });

    const systemPrompt = ollamaChat.mock.calls[0][0] as string;
    expect(systemPrompt).toContain(BASE_SYSTEM_PROMPT);
    expect(systemPrompt).toContain(
      '<catalogo>\n1. Tênis vermelho | calcado | R$ 199.00 | \n</catalogo>',
    );
  });

  it.each([
    ['an invented price', 'O Tênis vermelho está por R$ 49,90.'],
    ['an external link', 'Compre o Tênis vermelho em site-falso.com'],
  ])('replaces a reply with %s and drops cards', async (_, aiReply) => {
    const useCase = new GenerateChatV2ReplyUseCase(
      { invoke: jest.fn().mockResolvedValue({ messages: [] }) } as never,
      {
        execute: jest.fn().mockResolvedValue({
          matches: [{ ...product, image_url: 'tenis.jpg' }],
        }),
      } as never,
      { chat: jest.fn().mockResolvedValue(aiReply) } as never,
    );

    const result = await useCase.execute({ userId: 'u1', message: 'tênis' });

    expect(result.reply).toBe(JUDGE_FALLBACK_REPLY);
    expect(result.products).toEqual([]);
  });
});
