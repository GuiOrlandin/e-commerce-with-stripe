import { ChatProductDto } from './parseSearchProductsToolResult';
import { groundProductsInReply } from './groundProductsInReply';

const iphone: ChatProductDto = {
  id: '1',
  name: 'Iphone pro max 15',
  description: 'celular',
  image_url: '/files/a.jpg',
  unit_value: 13000,
  stock: 4,
  category: 'eletronicos',
  score: 0.7,
};

const tenis: ChatProductDto = {
  id: '2',
  name: 'Tênis vermelho',
  description: null,
  image_url: '/files/b.jpg',
  unit_value: 199,
  stock: 2,
  category: 'calcado',
  score: 0.9,
};

describe('groundProductsInReply', () => {
  it('drops products not mentioned in the reply (decline / off-topic)', () => {
    const reply =
      'Entendo que você está pensando em adotar um cachorro, mas isso não está relacionado aos produtos da loja.';

    expect(groundProductsInReply([iphone], reply)).toEqual([]);
  });

  it('keeps only products named in the reply', () => {
    const reply = 'Recomendo o Tênis vermelho por R$ 199.';

    expect(groundProductsInReply([iphone, tenis], reply)).toEqual([tenis]);
  });

  it('matches product names case-insensitively', () => {
    const reply = 'Que tal o tênis vermelho?';

    expect(groundProductsInReply([tenis], reply)).toEqual([tenis]);
  });

  it('returns empty when reply is empty', () => {
    expect(groundProductsInReply([tenis], '')).toEqual([]);
  });
});
