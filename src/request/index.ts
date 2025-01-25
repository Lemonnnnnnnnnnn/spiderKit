import type { Fetcher, FetcherOptions, PlaywrightCapableFetcher } from '../request/fetchers/types';
import type { FetcherType } from '../types';
import { AxiosFetcher } from '../request/fetchers/axios';
import { PlaywrightFetcher } from '../request/fetchers/playwright';

export type { FetcherOptions as RequestOptions };

export class Request<T extends Fetcher = Fetcher> {
    fetcher: T;

    constructor(options: FetcherOptions = {}, fetcherType: FetcherType = 'axios') {
        this.fetcher = this.createFetcher(fetcherType, options) as T;
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

// 为了方便使用，添加类型别名
export type PlaywrightRequest = Request<PlaywrightCapableFetcher>; 