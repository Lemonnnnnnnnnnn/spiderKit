import type { Fetcher, FetcherOptions } from '../request/fetchers/types';
import type { FetcherType } from '../types';
import { AxiosFetcher } from '../request/fetchers/axios';
import { PlaywrightFetcher } from '../request/fetchers/playwright';
import { RawHttpFetcher } from './fetchers/raw-http';

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
      case 'raw-http':
        return new RawHttpFetcher(options);
      case 'axios':
      default:
        return new AxiosFetcher(options);
    }
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    return this.fetcher.fetchText(url, headers);
  }

  async fetchBuffer(url: string, headers?: Record<string, string>): Promise<Buffer> {
    return this.fetcher.fetchBuffer(url, headers);
  }

  async close(): Promise<void> {
    if (this.fetcher.close) {
      await this.fetcher.close();
    }
  }
} 