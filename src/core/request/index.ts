import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { RequestOptions, ProgressCallback, RequestContext } from './types';
import type { ClientRequest, IncomingMessage } from 'http';

export type { RequestOptions as RequestOptions };

/**
 * HTTP请求客户端
 */
export class Request {
  private proxyAgent: HttpsProxyAgent<string> | null = null;
  private readonly options: RequestOptions;

  constructor(options: RequestOptions = {}) {
    this.options = options;
    this.initializeProxy(options);
  }

  private initializeProxy(options: RequestOptions): void {
    if (options.proxy) {
      const { protocol, host, port } = options.proxy;
      const proxyUrl = `${protocol}://${host}:${port}`;
      this.proxyAgent = new HttpsProxyAgent(proxyUrl);
    }
  }

  private createRequestOptions(
    url: string, 
    headers?: Record<string, string>,
    startPosition?: number
  ): https.RequestOptions {
    const parsedUrl = new URL(url);
    const requestHeaders = {
      ...headers,
      ...(startPosition && startPosition > 0 ? { 'Range': `bytes=${startPosition}-` } : {})
    };

    return {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: requestHeaders,
      agent: this.proxyAgent || undefined
    };
  }

  private async request(
    options: https.RequestOptions,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<RequestResult> {
    const context = this.createRequestContext(options, startPosition, onProgress, writeStream);

    return new Promise((resolve, reject) => {
      const req = https.request(options, async (res) => {
        context.response = res;
        this.logRequest(options, res.statusCode);

        try {
          // Handle range resume
          if (res.statusCode === 416) {
            return resolve({
              data: null,
              headers: res.headers as Record<string, string>
            });
          }

          if (startPosition > 0 && res.statusCode !== 206) {
            throw new Error('Server does not support resume');
          }

          // Handle response status
          if (!res.statusCode || res.statusCode >= 400) {
            throw new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
          }

          // Handle Content-Range
          if (res.statusCode === 206) {
            const range = res.headers['content-range'];
            if (range) {
              const match = range.match(/bytes \d+-\d+\/(\d+)/);
              if (match) {
                context.totalLength = parseInt(match[1], 10);
              }
            }
          } else {
            context.totalLength = parseInt(res.headers['content-length'] || '0', 10);
          }

          this.handleRequestStream(res, context, resolve);
        } catch (error) {
          reject(error);
        }
      });

      this.attachErrorHandler(req, options, reject);
      req.end();
    });
  }

  private createRequestContext(
    options: https.RequestOptions,
    startPosition: number,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>
  ): RequestContext {
    return {
      options: this.options,
      data: null,
      headers: {},
      url: `https://${options.hostname}${options.path}`,
      startPosition,
      onProgress,
      writeStream,
      chunks: [],
      receivedLength: 0,
      totalLength: 0
    };
  }

  private handleRequestStream(
    res: IncomingMessage, 
    context: RequestContext,
    resolve: (value: RequestResult) => void
  ): void {
    res.on('data', (chunk: Buffer) => {
      this.processChunk(chunk, context);
    });

    res.on('end', () => {
      this.finalizeRequest(context, resolve);
    });
  }

  private processChunk(chunk: Buffer, context: RequestContext): void {
    if (context.writeStream) {
      context.writeStream(chunk);
    } else {
      context.chunks.push(chunk);
    }
    context.receivedLength += chunk.length;
    
    if (context.totalLength > 0 && context.onProgress) {
      context.onProgress(context.receivedLength, context.totalLength);
    }
  }

  private finalizeRequest(
    context: RequestContext,
    resolve: (value: RequestResult) => void
  ): void {
    const result: RequestResult = {
      data: context.writeStream ? null : Buffer.concat(context.chunks),
      headers: context.headers
    };
    resolve(result);
  }

  private attachErrorHandler(
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

  private logRequest(options: https.RequestOptions, statusCode?: number): void {
    console.debug(`[${options.method}] ${options.hostname}${options.path} - ${statusCode}`);
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    const options = this.createRequestOptions(url, headers);
    const { data } = await this.request(options);
    return data?.toString('utf-8') ?? '';
  }

  async fetchBuffer(
    url: string, 
    headers?: Record<string, string>,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<Buffer> {
    const requestOptions = this.createRequestOptions(url, headers, startPosition);
    const { data } = await this.request(requestOptions, onProgress, writeStream, startPosition);
    return data ?? Buffer.from([]);
  }

  async fetchHeaders(url: string, headers?: Record<string, string>): Promise<Record<string, string>> {
    const options = this.createRequestOptions(url, headers);
    options.method = 'HEAD';  // 使用 HEAD 请求只获取头信息
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            resolve(res.headers as Record<string, string>);
        });

        req.on('error', reject);
        req.end();
    });
  }

  async close(): Promise<void> {
    if (this.proxyAgent) {
      this.proxyAgent.destroy();
      this.proxyAgent = null;
    }
  }
}

interface RequestResult {
  data: Buffer | null;
  headers: Record<string, string>;
} 