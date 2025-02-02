import { BaseRequest } from './base';
import { BufferRequest } from './buffer';
import type { ProgressCallback, RequestOptions } from './types';

export type { RequestOptions };

/**
 * HTTP请求客户端
 */
export class Request {
  private baseRequest: BaseRequest;
  private bufferRequest: BufferRequest;

  constructor(options: RequestOptions = {}) {
    this.baseRequest = new BaseRequest(options);
    this.bufferRequest = new BufferRequest(options);
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    return this.baseRequest.fetchText(url, headers);
  }

  async fetchBuffer(
    url: string, 
    headers?: Record<string, string>,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<Buffer> {
    return this.bufferRequest.fetchBuffer(url, headers, onProgress, writeStream, startPosition);
  }

  async fetchHeaders(url: string, headers?: Record<string, string>): Promise<Record<string, string>> {
    return this.baseRequest.fetchHeaders(url, headers);
  }

  async close(): Promise<void> {
    await Promise.all([
      this.baseRequest.close(),
      this.bufferRequest.close()
    ]);
  }
}

// 这些类型和工厂类可以保留，以便将来需要直接使用这些类
export type { RequestResult } from './base';
export { BaseRequest, BufferRequest };

export class RequestFactory {
  static createRequest(options: RequestOptions = {}): BaseRequest {
    return new BaseRequest(options);
  }

  static createBufferRequest(options: RequestOptions = {}): BufferRequest {
    return new BufferRequest(options);
  }
} 