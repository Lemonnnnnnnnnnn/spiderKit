import type { Fetcher, FetcherOptions, ProgressCallback } from './fetchers/types';
import type { FetcherType } from '../../types';
import { PlaywrightFetcher } from './fetchers/playwright';
import { RawHttpFetcher } from './fetchers/raw-http';

export type { FetcherOptions as RequestOptions };

export class Request {
  private fetcher: Fetcher;

  constructor(options: FetcherOptions = {}, fetcherType: FetcherType = 'raw-http') {
    this.fetcher = this.createFetcher(fetcherType, options);
  }

  private createFetcher(type: FetcherType, options: FetcherOptions): Fetcher {
    switch (type) {
      case 'playwright':
        return new PlaywrightFetcher(options);
      case 'raw-http':
      default:
        return new RawHttpFetcher(options);
    }
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    return this.fetcher.fetchText(url, headers);
  }

  async fetchBuffer(
    url: string,
    headers?: Record<string, string>,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<Buffer> {
    return this.fetcher.fetchBuffer(url, headers, onProgress, writeStream, startPosition);
  }

  async fetchHeaders(url: string, headers?: Record<string, string>): Promise<Record<string, string>> {
    return this.fetcher.fetchHeaders(url, headers);
  }

  async close(): Promise<void> {
    if (this.fetcher.close) {
      await this.fetcher.close();
    }
  }
} 