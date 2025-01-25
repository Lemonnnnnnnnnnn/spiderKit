import type { Fetcher, FetcherOptions } from './fetchers/types';
import { AxiosFetcher } from './fetchers/axios';
import { PlaywrightFetcher } from './fetchers/playwright';

export type { FetcherOptions as RequestOptions };

export class Request {
  private fetcher: Fetcher;

  constructor(options: FetcherOptions = {}, useBrowser: boolean = false) {
    this.fetcher = useBrowser 
      ? new PlaywrightFetcher(options)
      : new AxiosFetcher(options);
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