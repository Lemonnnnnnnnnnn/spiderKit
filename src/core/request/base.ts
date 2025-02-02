import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { RequestOptions } from './types';
import type { ClientRequest } from 'http';

export interface RequestResult {
  data: Buffer | null;
  headers: Record<string, string>;
}

export class BaseRequest {
  protected proxyAgent: HttpsProxyAgent<string> | null = null;
  protected readonly options: RequestOptions;

  constructor(options: RequestOptions = {}) {
    this.options = options;
    this.initializeProxy(options);
  }

  protected initializeProxy(options: RequestOptions): void {
    if (options.proxy) {
      const { protocol, host, port } = options.proxy;
      const proxyUrl = `${protocol}://${host}:${port}`;
      this.proxyAgent = new HttpsProxyAgent(proxyUrl);
    }
  }

  protected createRequestOptions(
    url: string, 
    headers?: Record<string, string>
  ): https.RequestOptions {
    const parsedUrl = new URL(url);
    return {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers,
      agent: this.proxyAgent || undefined
    };
  }

  protected async baseRequest(
    options: https.RequestOptions
  ): Promise<RequestResult> {
    return new Promise((resolve, reject) => {
      const req = https.request(options, async (res) => {
        this.logRequest(options, res.statusCode);
        const chunks: Buffer[] = [];

        try {
          if (!res.statusCode || res.statusCode >= 400) {
            throw new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
          }

          res.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            resolve({
              data: Buffer.concat(chunks),
              headers: res.headers as Record<string, string>
            });
          });
        } catch (error) {
          reject(error);
        }
      });

      this.attachErrorHandler(req, options, reject);
      req.end();
    });
  }

  protected attachErrorHandler(
    req: ClientRequest,
    options: https.RequestOptions,
    reject: (reason: Error) => void
  ): void {
    req.on('error', (error) => {
      console.error('Request error:', {
        url: `${options.hostname}${options.path}`,
        error: error.message,
        stack: error.stack
      });
      reject(error);
    });
  }

  protected logRequest(options: https.RequestOptions, statusCode?: number): void {
    console.debug(`[${options.method}] ${options.hostname}${options.path} - ${statusCode}`);
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    const options = this.createRequestOptions(url, headers);
    const { data } = await this.baseRequest(options);
    return data?.toString('utf-8') ?? '';
  }

  async fetchHeaders(url: string, headers?: Record<string, string>): Promise<Record<string, string>> {
    const options = this.createRequestOptions(url, headers);
    options.method = 'HEAD';
    const { headers: responseHeaders } = await this.baseRequest(options);
    return responseHeaders;
  }

  async close(): Promise<void> {
    if (this.proxyAgent) {
      this.proxyAgent.destroy();
      this.proxyAgent = null;
    }
  }
} 