import * as https from 'https';
import type { IncomingMessage } from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { RequestOptions, ProgressCallback } from './types';

export type { RequestOptions as RequestOptions };

type RequestHandler = (
  context: RequestContext,
  next: () => Promise<void>
) => Promise<void>;

interface RequestContext {
  options: https.RequestOptions;
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

export class Request {
  private proxyAgent: HttpsProxyAgent<string> | null = null;
  private readonly maxRetries = 0;
  private readonly retryDelay = 1000;
  private readonly handlers: RequestHandler[] = [];
  private readonly options: RequestOptions = {};

  constructor(options: RequestOptions = {}) {
    this.options = options;
    // 初始化代理
    if (options.proxy) {
      const proxyUrl = `${options.proxy.protocol}://${options.proxy.host}:${options.proxy.port}`;
      this.proxyAgent = new HttpsProxyAgent(proxyUrl);
    }
    
    // 注册默认中间件
    this.use(this.handleRangeResume);
    this.use(this.handleRedirect);
    this.use(this.handleResponse);
  }

  private use(handler: RequestHandler) {
    this.handlers.push(handler);
  }

  private async executeMiddleware(context: RequestContext): Promise<void> {
    const dispatch = async (index: number): Promise<void> => {
      if (index >= this.handlers.length) return;
      
      await this.handlers[index](context, () => dispatch(index + 1));
    };

    await dispatch(0);
  }

  private async handleRangeResume(context: RequestContext, next: () => Promise<void>) {
    if (context.response?.statusCode === 416) {
      context.data = null;
      context.headers = context.response.headers as Record<string, string>;
      return;
    }

    if (context.startPosition > 0 && context.response?.statusCode !== 206) {
      throw new Error('Server does not support resume');
    }

    await next();
  }

  private async handleRedirect(context: RequestContext, next: () => Promise<void>) {
    const { response } = context;
    if (response?.statusCode && [301, 302, 303, 307, 308].includes(response.statusCode)) {
      const location = response.headers.location;
      if (location && typeof location === 'string') {
        const redirectOptions = this.createRequestOptions(
          location,
          context.options.headers as Record<string, string>,
          context.startPosition
        );
        context.options = redirectOptions;
        context.url = location;
        
        // 重新发起请求
        await this.request(redirectOptions, context.onProgress, context.writeStream, context.startPosition);
        return;
      }
    }

    await next();
  }

  private async handleResponse(context: RequestContext, next: () => Promise<void>) {
    const { response } = context;
    
    if (!response?.statusCode || response.statusCode >= 400) {
      throw new Error(`HTTP ${response?.statusCode}: ${response?.statusMessage}`);
    }

    // 处理 Content-Range
    if (response.statusCode === 206) {
      const range = response.headers['content-range'];
      if (range) {
        const match = range.match(/bytes \d+-\d+\/(\d+)/);
        if (match) {
          context.totalLength = parseInt(match[1], 10);
        }
      }
    } else {
      context.totalLength = parseInt(response.headers['content-length'] || '0', 10);
    }

    await next();
  }

  private createRequestOptions(
    url: string, 
    headers?: Record<string, string>,
    startPosition?: number
  ): https.RequestOptions {
    const parsedUrl = new URL(url);
    const options: https.RequestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        ...headers,
      },
    };

    // 添加断点续传的 Range 头
    if (startPosition && startPosition > 0) {
      options.headers = {
        ...options.headers,
        'Range': `bytes=${startPosition}-`
      };
    }

    if (this.proxyAgent) {
      options.agent = this.proxyAgent;
    }

    return options;
  }

  private request(
    options: https.RequestOptions,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<{ data: Buffer | null, headers: Record<string, string> }> {
    return new Promise((resolve, reject) => {
      const context: RequestContext = {
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

      const req = https.request(options, async (res) => {
        context.response = res;
        console.debug(`[${options.method}] ${context.url} - ${res.statusCode}`);

        try {
          await this.executeMiddleware(context);

          res.on('data', (chunk: Buffer) => {
            if (writeStream) {
              writeStream(chunk);
            } else {
              context.chunks.push(chunk);
            }
            context.receivedLength += chunk.length;
            
            if (context.totalLength > 0 && onProgress) {
              onProgress(context.receivedLength, context.totalLength);
            }
          });

          res.on('end', async () => {
            if (writeStream) {
              resolve({
                data: null,
                headers: context.headers
              });
            } else {
              context.data = Buffer.concat(context.chunks);
              resolve({
                data: context.data,
                headers: context.headers
              });
            }
          });
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', (error) => {
        console.error('Request error:', {
          url: `${options.hostname}${options.path}`,
          error: error.message,
          stack: error.stack
        });
        reject(error);
      });

      req.end();
    });
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
            if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode)) {
                const location = res.headers.location;
                if (location && typeof location === 'string') {
                    const redirectOptions = this.createRequestOptions(location, headers);
                    redirectOptions.method = 'HEAD';
                    return this.fetchHeaders(location, headers)
                        .then(resolve)
                        .catch(reject);
                }
            }
            resolve(res.headers as Record<string, string>);
        });

        req.on('error', reject);
        req.end();
    });
  }

  async close(): Promise<void> {
    // 清理代理相关资源
    if (this.proxyAgent) {
      this.proxyAgent.destroy();
      this.proxyAgent = null;
    }
  }

} 