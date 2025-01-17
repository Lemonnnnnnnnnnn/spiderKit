import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface RequestOptions {
  proxy?: {
    host: string;
    port: number;
    protocol?: string;
  };
  timeout?: number;
}

export class Request {
  private client: AxiosInstance;

  constructor(options: RequestOptions = {}) {
    const config: AxiosRequestConfig = {
      timeout: options.timeout || 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
      },
      validateStatus: status => status >= 200 && status < 300
    };

    if (options.proxy) {
      config.proxy = {
        host: options.proxy.host,
        port: options.proxy.port,
        protocol: options.proxy.protocol || 'http'
      };
    }

    this.client = axios.create(config);
  }

  async fetchText(url: string): Promise<string> {
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchBuffer(url: string): Promise<Buffer> {
    try {
      const response = await this.client.get(url, {
        responseType: 'arraybuffer'
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