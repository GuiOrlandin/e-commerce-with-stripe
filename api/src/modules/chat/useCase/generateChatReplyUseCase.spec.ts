import { GenerateChatReplyUseCase } from './generateChatReplyUseCase';
import { JUDGE_FALLBACK_REPLY } from './judgeReply';

describe('GenerateChatReplyUseCase', () => {
  const match = {
    id: 'p1',
    name: 'Tênis vermelho',
    description: null,
    unit_value: 199,
    category: 'calcado',
    score: 0.9,
  };

  const run = (aiReply: string) =>
    new GenerateChatReplyUseCase({
      chat: jest.fn().mockResolvedValue(aiReply),
    } as never).execute('tênis', [match]);

  it('keeps a reply with catalog prices', async () => {
    await expect(run('Temos o Tênis vermelho por R$ 199,00.')).resolves.toBe(
      'Temos o Tênis vermelho por R$ 199,00.',
    );
  });

  it.each(['Tênis vermelho por R$ 1,00!', 'Compre em www.site-falso.com'])(
    'replaces a rejected reply: %s',
    async (aiReply) => {
      await expect(run(aiReply)).resolves.toBe(JUDGE_FALLBACK_REPLY);
    },
  );
});
