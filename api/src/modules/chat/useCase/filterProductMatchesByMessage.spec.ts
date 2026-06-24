import { filterProductMatchesByMessage } from './filterProductMatchesByMessage';

const blackShirt = {
  id: '1',
  name: 'Camisa preta',
  description: 'camiseta preta fit',
  image_url: 'img.jpg',
  unit_value: 12,
  stock: 5,
  category: 'Roupas',
  score: 0.9,
};

const iphone = {
  id: '2',
  name: 'Iphone pro max 15',
  description: 'celular Iphone pro max 15 preto',
  image_url: 'iphone.jpg',
  unit_value: 13000,
  stock: 4,
  category: 'Eletrônicos',
  score: 0.9,
};

describe('filterProductMatchesByMessage', () => {
  it('rejects shirt when user asks for different color', () => {
    const result = filterProductMatchesByMessage('camisa roxa', [blackShirt]);
    expect(result).toEqual([]);
  });

  it('rejects shirt when user asks for pants', () => {
    const result = filterProductMatchesByMessage('calça preta', [blackShirt]);
    expect(result).toEqual([]);
  });

  it('accepts shirt when color and type match', () => {
    const result = filterProductMatchesByMessage('camisa preta', [blackShirt]);
    expect(result).toEqual([blackShirt]);
  });

  it('accepts products from any requested type in multi-category browse', () => {
    const result = filterProductMatchesByMessage(
      'opções de celular e camisas',
      [blackShirt, iphone],
    );
    expect(result).toEqual([blackShirt, iphone]);
  });
});
