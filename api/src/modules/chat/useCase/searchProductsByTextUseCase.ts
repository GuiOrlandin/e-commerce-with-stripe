import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaService } from 'src/infra/ai/ollama.service';
import {
  ProductRepository,
  ProductTextSearchResult,
} from 'src/modules/products/repositories/productRepository';
import {
  buildProductSearchQuery,
  extractMaxPrice,
  extractSearchTerms,
} from './extractSearchTerms';
import { filterProductMatchesByMessage } from './filterProductMatchesByMessage';
import {
  findAllMatchedTermsInMessage,
  findMatchedTermInMessage,
  PRODUCT_TYPE_GROUPS,
  COLOR_GROUPS,
} from './productAttributeGroups';
import { applyRerankOrder, parseRerankOrderedIds } from './rerankOrder';
import { rrfMerge } from './rrfMerge';

const RERANK_SYSTEM = `You reorder product candidates for a store search.
Reply with ONLY JSON: {"orderedIds":["id1","id2",...]} using the given ids, most relevant first.
Do not invent ids. Do not add commentary.`;

@Injectable()
export class SearchProductsByTextUseCase {
  private readonly logger = new Logger(SearchProductsByTextUseCase.name);

  constructor(
    private ollama: OllamaService,
    private productRepository: ProductRepository,
    private config: ConfigService,
  ) {}

  async execute(message: string) {
    const topK = this.config.get<number>('CHAT.topK')!;
    const retrieveK = this.config.get<number>('CHAT.retrieveK')!;
    const rerankN = this.config.get<number>('CHAT.rerankN')!;
    const rrfK = this.config.get<number>('CHAT.rrfK')!;
    const rerankEnabled = this.config.get<boolean>('CHAT.rerankEnabled')!;

    const typeTerms = findAllMatchedTermsInMessage(
      message,
      PRODUCT_TYPE_GROUPS,
    );
    const colorTerm = findMatchedTermInMessage(message, COLOR_GROUPS);

    let candidates: ProductTextSearchResult[] = [];

    if (typeTerms.length > 1) {
      // ponytail: keep multi-type loop until eval shows single hybrid query is enough
      for (const type of typeTerms) {
        const searchQuery = [type, colorTerm].filter(Boolean).join(' ');
        candidates.push(
          ...(await this.hybridRetrieve(searchQuery, retrieveK, rrfK)),
        );
      }
      candidates = this.mergeUniquePreserveOrder(candidates);
    } else {
      const searchQuery = buildProductSearchQuery(message);
      candidates = await this.hybridRetrieve(searchQuery, retrieveK, rrfK);
    }

    let ordered = candidates;
    if (rerankEnabled && ordered.length > 1) {
      ordered = await this.rerankWithOllama(
        message,
        ordered.slice(0, rerankN),
      );
    }

    let matches = filterProductMatchesByMessage(message, ordered);
    // ponytail: if filters wipe reranked list, retry on full RRF candidates
    if (matches.length === 0 && rerankEnabled) {
      matches = filterProductMatchesByMessage(message, candidates);
    }

    const maxPrice = extractMaxPrice(message);
    if (maxPrice !== null) {
      matches = matches.filter((product) => product.unit_value <= maxPrice);
    }

    matches = matches.slice(0, topK);

    return { candidates, matches };
  }

  private async hybridRetrieve(
    searchQuery: string,
    retrieveK: number,
    rrfK: number,
  ): Promise<ProductTextSearchResult[]> {
    if (!searchQuery) {
      return [];
    }

    const extracted = extractSearchTerms(searchQuery);
    const terms =
      extracted.length > 0
        ? extracted
        : searchQuery.split(/\s+/).filter(Boolean);

    const keywordPromise = this.productRepository.searchByKeywords(
      terms,
      retrieveK,
    );
    const semanticPromise = this.ollama
      .embed(searchQuery)
      .then((embedding) =>
        this.productRepository.searchByTextEmbedding(embedding, retrieveK),
      );

    const [semantic, keyword] = await Promise.all([
      semanticPromise,
      keywordPromise,
    ]);

    return rrfMerge([semantic, keyword], rrfK);
  }

  private async rerankWithOllama(
    message: string,
    candidates: ProductTextSearchResult[],
  ): Promise<ProductTextSearchResult[]> {
    const catalog = candidates.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: (p.description ?? '').slice(0, 160),
    }));

    try {
      const raw = await this.ollama.chat(
        RERANK_SYSTEM,
        `Query: ${message}\nCandidates:\n${JSON.stringify(catalog)}`,
        { temperature: 0 },
      );
      const orderedIds = parseRerankOrderedIds(raw);
      if (!orderedIds) {
        this.logger.warn('Rerank parse failed; keeping RRF order');
        return candidates;
      }
      return applyRerankOrder(candidates, orderedIds);
    } catch (err) {
      this.logger.warn(
        `Rerank Ollama failed; keeping RRF order: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return candidates;
    }
  }

  /** Dedupe by id, keep first-seen order (preserves RRF across subqueries). */
  private mergeUniquePreserveOrder(products: ProductTextSearchResult[]) {
    const byId = new Map<string, ProductTextSearchResult>();
    for (const product of products) {
      if (!byId.has(product.id)) {
        byId.set(product.id, product);
      }
    }
    return [...byId.values()];
  }
}
