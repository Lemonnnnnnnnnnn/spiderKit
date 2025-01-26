import * as tls from 'tls';
import * as https from 'https';
import type { Fetcher, FetcherOptions } from './types';

export class TlsFetcher implements Fetcher {
  private options: FetcherOptions;
  private ciphers: string;

  constructor(options: FetcherOptions = {}) {
    this.options = options;
    this.ciphers = this.shuffleCiphers();
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
      timeout: this.options.timeout || 30000
    };

    // 添加代理支持
    if (this.options.proxy) {
        // @ts-expect-error
      requestOptions.proxy = `${this.options.proxy.protocol}://${this.options.proxy.host}:${this.options.proxy.port}`;
      requestOptions.headers = {
        ...requestOptions.headers,
        'Proxy-Connection': 'keep-alive'
      };
    }

    return requestOptions;
  }

  private request(options: https.RequestOptions): Promise<{ data: Buffer, headers: Record<string, string> }> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      const req = https.request(options, (res) => {
        // 处理重定向
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers.location;
          if (location) {
            const redirectOptions = this.createRequestOptions(location);
            return this.request(redirectOptions)
              .then(resolve)
              .catch(reject);
          }
        }

        res.on('data', (chunk: Buffer) => chunks.push(chunk));

        res.on('end', () => {
          const data = Buffer.concat(chunks);
          resolve({
            data,
            headers: res.headers as Record<string, string>
          });
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
    return data.toString('utf-8');
  }

  async fetchBuffer(url: string, headers?: Record<string, string>): Promise<Buffer> {
    const options = this.createRequestOptions(url, headers);
    const { data } = await this.request(options);
    return data;
  }

  async close(): Promise<void> {
    // 无需实现关闭逻辑
  }
} 