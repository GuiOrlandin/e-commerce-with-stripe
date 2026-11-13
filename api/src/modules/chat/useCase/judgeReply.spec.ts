import { judgeReply } from './judgeReply';

const catalog = [
  { unit_value: 49.9 },
  { unit_value: 1299 },
  { unit_value: 199 },
];

describe('judgeReply', () => {
  it.each([
    'O Tênis vermelho sai por R$ 199.',
    'Custa R$ 49,90.',
    'Custa R$49.90.',
    'O notebook custa R$ 1.299,00.',
    'O notebook custa R$ 1.299.',
    'Temos o Tênis vermelho por R$ 199,00 e a camiseta por R$ 49,90.',
  ])('accepts catalog prices: %s', (reply) => {
    expect(judgeReply(reply, catalog)).toEqual({ ok: true });
  });

  it('accepts a plain reply without prices or links', () => {
    expect(judgeReply('Olá! Como posso ajudar?', [])).toEqual({ ok: true });
  });

  it('rejects an invented price', () => {
    expect(judgeReply('Hoje está por R$ 1,00!', catalog)).toEqual({
      ok: false,
      reasons: ['price not in catalog: R$ 1,00'],
    });
  });

  it('rejects any price when there are no products', () => {
    expect(judgeReply('Sai por R$ 199', []).ok).toBe(false);
  });

  it.each([
    'Compre em https://loja.exemplo/oferta',
    'Veja http://x.y',
    'Acesse www.promo.net',
    'Compre em site-falso.com',
    'Compre em loja.com.br',
  ])('rejects links: %s', (reply) => {
    expect(judgeReply(reply, catalog).ok).toBe(false);
  });
});
