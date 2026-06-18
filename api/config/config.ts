import * as process from 'process';

const configs = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  GLOBAL: {
    PORT: process.env.PORT || 3000,
  },
  OLLAMA: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    chatModel: process.env.OLLAMA_CHAT_MODEL || 'gemma3:4b',
    embedModel: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
  },
  EMBEDDING_SERVICE: {
    baseUrl: process.env.EMBEDDING_SERVICE_URL || 'http://localhost:8000',
  },
  CHAT: {
    similarityThreshold: parseFloat(process.env.CHAT_SIMILARITY_THRESHOLD || '0.65'),
    topK: parseInt(process.env.CHAT_TOP_K || '5', 10),
  },
  STRIPE_CONFIG: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookConfig: {
      requestBodyProperty: 'rawBody',
      stripeSecrets: {
        account: process.env.STRIPE_WEBHOOK_SECRET_KEY,
      },
    },
  },
});

export default configs;
