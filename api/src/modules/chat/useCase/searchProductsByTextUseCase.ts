import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaService } from 'src/infra/ai/ollama.service';
import {
  ProductRepository,
  ProductTextSearchResult,
} from 'src/modules/products/repositories/productRepository';
import {
  buildProductSearchQuery,
  extractMaxPrice,
} from './extractSearchTerms';
import { filterProductMatchesByMessage } from './filterProductMatchesByMessage';
import {
  findAllMatchedTermsInMessage,
  findMatchedTermInMessage,
  PRODUCT_TYPE_GROUPS,
  COLOR_GROUPS,
} from './productAttributeGroups';

@Injectable()
export class SearchProductsByTextUseCase {
  constructor(
    private ollama: OllamaService,
    private productRepository: ProductRepository,
    private config: ConfigService,
  ) {}

  async execute(message: string) {
    const topK = this.config.get<number>('CHAT.topK')!;
    const threshold = this.config.get<number>('CHAT.similarityThreshold')!;
    const typeTerms = findAllMatchedTermsInMessage(
      message,
      PRODUCT_TYPE_GROUPS,
    );
    const colorTerm = findMatchedTermInMessage(message, COLOR_GROUPS);

    let candidates: ProductTextSearchResult[] = [];
    let matches: ProductTextSearchResult[] = [];

    if (typeTerms.length > 1) {
      for (const type of typeTerms) {
        const searchQuery = [type, colorTerm].filter(Boolean).join(' ');
        const result = await this.searchForQuery(
          message,
          searchQuery,
          topK,
          threshold,
        );
        candidates.push(...result.candidates);
        matches.push(...result.matches);
      }
      candidates = this.mergeByBestScore(candidates);
      matches = this.mergeUnique(matches);
    } else {
      const searchQuery = buildProductSearchQuery(message);
      const result = await this.searchForQuery(
        message,
        searchQuery,
        topK,
        threshold,
      );
      candidates = result.candidates;
      matches = result.matches;
    }

    const maxPrice = extractMaxPrice(message);
    if (maxPrice !== null) {
      matches = matches.filter((product) => product.unit_value <= maxPrice);
    }

    return { candidates, matches };
  }

  private async searchForQuery(
    message: string,
    searchQuery: string,
    topK: number,
    threshold: number,
  ) {
    if (!searchQuery) {
      return { candidates: [], matches: [] };
    }

    const embedding = await this.ollama.embed(searchQuery);
    const candidates = await this.productRepository.searchByTextEmbedding(
      embedding,
      topK,
    );

    const thresholdMatches = candidates.filter((c) => c.score >= threshold);
    let matches = filterProductMatchesByMessage(message, thresholdMatches);

    if (matches.length === 0) {
      const terms = searchQuery.split(/\s+/).filter(Boolean);
      const keywordHits = await this.productRepository.searchByKeywords(
        terms,
        topK,
      );
      matches = filterProductMatchesByMessage(message, keywordHits);
    }

    return { candidates, matches };
  }

  private mergeUnique(products: ProductTextSearchResult[]) {
    const byId = new Map<string, ProductTextSearchResult>();
    for (const product of products) {
      byId.set(product.id, product);
    }
    return [...byId.values()];
  }

  private mergeByBestScore(products: ProductTextSearchResult[]) {
    const byId = new Map<string, ProductTextSearchResult>();
    for (const product of products) {
      const existing = byId.get(product.id);
      if (!existing || product.score > existing.score) {
        byId.set(product.id, product);
      }
    }
    return [...byId.values()];
  }
}
