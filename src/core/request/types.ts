export interface RequestOptions {
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
