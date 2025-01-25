import type { Fetcher, FetcherOptions } from './fetchers/types';
import type { FetcherType } from '../types';
import { AxiosFetcher } from './fetchers/axios';
import { PlaywrightFetcher } from './fetchers/playwright';

export type { FetcherOptions as RequestOptions };

export class Request {
  private fetcher: Fetcher;

  constructor(options: FetcherOptions = {}, fetcherType: FetcherType = 'axios') {
    this.fetcher = this.createFetcher(fetcherType, options);
  }

  private createFetcher(type: FetcherType, options: FetcherOptions): Fetcher {
    switch (type) {
      case 'playwright':
        return new PlaywrightFetcher(options);
      case 'axios':
      default:
        return new AxiosFetcher(options);
    }
  }

  async fetchText(url: string): Promise<string> {
    return this.fetcher.fetchText(url);
  }

  async fetchBuffer(url: string): Promise<Buffer> {
    return this.fetcher.fetchBuffer(url);
  }

  async close(): Promise<void> {
    if (this.fetcher.close) {
      await this.fetcher.close();
    }
  }
} 