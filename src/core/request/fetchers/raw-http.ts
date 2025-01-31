import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import type { Fetcher, FetcherOptions, ProgressCallback } from './types';

export class RawHttpFetcher implements Fetcher {
  private proxyAgent: HttpsProxyAgent<string> | null = null;

  constructor(options: FetcherOptions = {}) {
    // 初始化代理
    if (options.proxy) {
      const proxyUrl = `${options.proxy.protocol}://${options.proxy.host}:${options.proxy.port}`;
      this.proxyAgent = new HttpsProxyAgent(proxyUrl);
    }
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
      }
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
      const chunks: Buffer[] = [];
      let receivedLength = 0;  // 只计算本次请求接收的数据
      let totalLength = 0;     // 完整文件大小

      const req = https.request(options, (res) => {
        // 添加对 416 状态码的处理
        if (res.statusCode === 416) {
          // 如果服务器返回 Range Not Satisfiable，说明文件已经完全下载
          resolve({
            data: null,
            headers: res.headers as Record<string, string>
          });
          return;
        }

        // 处理重定向
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers.location;
          if (location && typeof location === 'string') {
            const redirectOptions = this.createRequestOptions(
              location,
              options.headers as Record<string, string>,
              startPosition
            );
            return this.request(redirectOptions, onProgress, writeStream, startPosition)
              .then(resolve)
              .catch(reject);
          }
        }

        // 检查是否支持断点续传
        if (startPosition > 0 && res.statusCode !== 206) {
          reject(new Error('Server does not support resume'));
          return;
        }

        // 获取内容总长度
        if (res.statusCode === 206) {
          // 处理 Content-Range: bytes 0-1023/146515
          const range = res.headers['content-range'];
          if (range) {
            const match = range.match(/bytes \d+-\d+\/(\d+)/);
            if (match) {
              totalLength = parseInt(match[1], 10);  // 从 Content-Range 获取完整文件大小
            }
          }
        } else {
          totalLength = parseInt(res.headers['content-length'] || '0', 10);
        }

        res.on('data', (chunk: Buffer) => {
          if (writeStream) {
            writeStream(chunk);
          } else {
            chunks.push(chunk);
          }
          receivedLength += chunk.length;
          
          if (totalLength > 0 && onProgress) {
            // 对于断点续传，传递完整文件大小和当前下载进度
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

      req.on('error', reject);
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