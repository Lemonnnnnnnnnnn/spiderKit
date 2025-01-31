import * as tls from 'tls';
import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { Fetcher, FetcherOptions, ProgressCallback } from './types';

export class RawHttpFetcher implements Fetcher {
  private options: FetcherOptions;
  private ciphers: string;
  private proxyAgent: HttpsProxyAgent<string> | null = null;

  constructor(options: FetcherOptions = {}) {
    this.options = options;
    this.ciphers = this.shuffleCiphers();
    
    // 初始化代理
    if (options.proxy) {
      const proxyUrl = `${options.proxy.protocol}://${options.proxy.host}:${options.proxy.port}`;
      this.proxyAgent = new HttpsProxyAgent(proxyUrl);
    }
  }

  private shuffleCiphers(): string {
    const defaultCiphers = tls.DEFAULT_CIPHERS.split(':');
    return [
      defaultCiphers[0],
      defaultCiphers[2],
      defaultCiphers[1],
      ...defaultCiphers.slice(3)
    ].join(':');
  }

  private createRequestOptions(url: string, headers?: Record<string, string>): https.RequestOptions {
    const urlObj = new URL(url);
    const requestOptions: https.RequestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      port: urlObj.port || 443,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      },
      ciphers: this.ciphers,
      timeout: this.options.timeout || 30000,
      agent: this.proxyAgent || undefined,
      rejectUnauthorized: false // 可选：忽略 SSL 证书验证
    };

    return requestOptions;
  }

  private request(
    options: https.RequestOptions,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>
  ): Promise<{ data: Buffer | null, headers: Record<string, string> }> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      let receivedLength = 0;
      let totalLength = 0;

      const req = https.request(options, (res) => {
        // 处理重定向
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers.location;
          if (location) {
            const redirectOptions = this.createRequestOptions(location);
            return this.request(redirectOptions, onProgress, writeStream)
              .then(resolve)
              .catch(reject);
          }
        }

        // 获取内容总长度
        totalLength = parseInt(res.headers['content-length'] || '0', 10);

        res.on('data', (chunk: Buffer) => {
          if (writeStream) {
            // 流式写入文件
            writeStream(chunk);
          } else {
            chunks.push(chunk);  // chunk 已经是 Buffer，直接使用
          }
          receivedLength += chunk.length;
          
          // 报告下载进度
          if (totalLength > 0 && onProgress) {
            onProgress(receivedLength, totalLength);
          }
        });

        res.on('end', async () => {
          if (writeStream) {
            resolve({
              data: null,
              headers: res.headers as Record<string, string>
            });
          } else {
            const data = Buffer.concat(chunks);
            resolve({
              data,
              headers: res.headers as Record<string, string>
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
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
    writeStream?: (chunk: Buffer) => Promise<void>
  ): Promise<Buffer> {
    const requestOptions = this.createRequestOptions(url, headers);
    const { data } = await this.request(requestOptions, onProgress, writeStream);
    return data ?? Buffer.from([]);
  }

  async close(): Promise<void> {
    // 清理代理相关资源
    if (this.proxyAgent) {
      this.proxyAgent.destroy();
      this.proxyAgent = null;
    }
  }
} 