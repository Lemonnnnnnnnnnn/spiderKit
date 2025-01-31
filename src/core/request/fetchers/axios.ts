import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { Fetcher, FetcherOptions, ProgressCallback } from './types';
import { HttpsProxyAgent } from 'https-proxy-agent';

export class AxiosFetcher implements Fetcher {
  private client: AxiosInstance;
  private defaultHeaders: Record<string, string>;

  constructor(private options: FetcherOptions = {}) {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Connection': 'keep-alive',
    };

    const config: AxiosRequestConfig = {
      timeout: options.timeout || 30000,
      headers: this.defaultHeaders,
      validateStatus: status => status >= 200 && status < 300
    };

    if (options.proxy) {
      const proxyUrl = `${options.proxy.protocol}://${options.proxy.host}:${options.proxy.port}`;
      config.httpsAgent = new HttpsProxyAgent(proxyUrl);
      config.proxy = false;
    }

    this.client = axios.create(config);
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    try {
      const response = await this.client.get(url, {
        headers: { ...this.defaultHeaders, ...headers },
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchBuffer(
    url: string, 
    headers?: Record<string, string>,
    onProgress?: ProgressCallback
  ): Promise<Buffer> {
    try {
      const response = await this.client.get(url, {
        headers,
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress(progressEvent.loaded, progressEvent.total);
          }
        }
      });
      return Buffer.from(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch buffer from ${url}: ${error.message}`);
      }
      throw error;
    }
  }
} 