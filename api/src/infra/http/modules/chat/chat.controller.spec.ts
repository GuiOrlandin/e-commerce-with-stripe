import { ChatController } from './chat.controller';

describe('ChatController POST /chat (v1)', () => {
  const match = (name: string) => ({
    id: name,
    name,
    description: null,
    image_url: 'x.jpg',
    unit_value: 10,
    stock: 1,
    category: 'c',
    score: 0.9,
  });
  const matches = [match('Camiseta azul'), match('Boné preto')];

  const chat = (reply: string) =>
    new ChatController(
      {
        execute: jest.fn().mockResolvedValue({ candidates: matches, matches }),
      } as never,
      { execute: jest.fn().mockResolvedValue(reply) } as never,
      {} as never,
    ).chat({ message: 'o que vocês têm?' } as never);

  it('browse reply that lists the products keeps their cards', async () => {
    const res = await chat(
      'Temos a Camiseta azul (R$ 10) e o Boné preto (R$ 10).',
    );
    expect(res.products.map((p) => p.name)).toEqual([
      'Camiseta azul',
      'Boné preto',
    ]);
  });

  it('refusal ships no cards', async () => {
    const res = await chat('Desculpe, só posso ajudar com produtos da loja.');
    expect(res.products).toEqual([]);
  });
});
