export interface FetcherOptions {
  proxy?: {
    host: string;
    port: number;
    protocol?: string;
  };
  timeout?: number;
}

export interface Fetcher {
  fetchText(url: string): Promise<string>;
  fetchBuffer(url: string): Promise<Buffer>;
  close?(): Promise<void>;
} 