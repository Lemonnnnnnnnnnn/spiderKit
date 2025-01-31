
export interface FetcherOptions {
  proxy?: {
    host: string;
    port: number;
    protocol?: string;
  };
  timeout?: number;
  debug?: boolean;
}

export interface ProgressCallback {
  (downloaded: number, total: number): void;
}

export interface Fetcher {
  fetchText(url: string, headers?: Record<string, string>): Promise<string>;
  fetchBuffer(
    url: string, 
    headers?: Record<string, string>,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>
  ): Promise<Buffer>;
  close?(): Promise<void>;
} 

