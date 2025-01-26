export interface FetcherOptions {
  proxy?: {
    host: string;
    port: number;
    protocol?: string;
  };
  timeout?: number;
  debug?: boolean;
}

export interface Fetcher {
  fetchText(url: string, headers?: Record<string, string>): Promise<string>;
  fetchBuffer(url: string, headers?: Record<string, string>): Promise<Buffer>;
  close?(): Promise<void>;
} 