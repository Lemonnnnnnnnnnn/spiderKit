import type { Page } from 'playwright';

export interface FetcherOptions {
  proxy?: {
    host: string;
    port: number;
    protocol?: string;
  };
  timeout?: number;
}

export interface Fetcher {
  fetchText(url: string, headers?: Record<string, string>): Promise<string>;
  fetchBuffer(url: string, headers?: Record<string, string>): Promise<Buffer>;
  close?(): Promise<void>;

  openPage?(url: string, pageId: string): Promise<Page>;
  closePage?(pageId: string): Promise<void>;
  evaluateScript?<T>(pageId: string, script: Function, ...args: any[]): Promise<T>;
}

export interface PlaywrightCapableFetcher extends Fetcher {
  openPage: (url: string, pageId: string) => Promise<Page>;
  closePage: (pageId: string) => Promise<void>;
  evaluateScript: <T>(pageId: string, script: Function, ...args: any[]) => Promise<T>;
  getPageById: (pageId: string) => Promise<Page>;
}

export function isPlaywrightCapable(fetcher: Fetcher): fetcher is PlaywrightCapableFetcher {
  return 'openPage' in fetcher && 'closePage' in fetcher && 'evaluateScript' in fetcher;
} 