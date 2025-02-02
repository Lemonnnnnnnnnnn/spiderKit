import type { IncomingMessage } from 'http';
import { Agent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

export type ProgressCallback = (received: number, total: number) => void;

export interface RequestOptions {
  proxy?: {
    protocol: string;
    host: string;
    port: number;
  };
  timeout?: number;
  headers?: Record<string, string>;
  agent?: Agent | HttpsProxyAgent<string>;
}

export interface RequestContext {
  options: RequestOptions;
  response?: IncomingMessage;
  data: Buffer | null;
  headers: Record<string, string>;
  url: string;
  startPosition: number;
  onProgress?: ProgressCallback;
  writeStream?: (chunk: Buffer) => Promise<void>;
  chunks: Buffer[];
  receivedLength: number;
  totalLength: number;
}

export type RequestHandler = (
  context: RequestContext,
  next: () => Promise<void>
) => Promise<void>;
