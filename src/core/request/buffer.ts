import * as https from 'https';
import type { IncomingMessage } from 'http';
import type { ProgressCallback, RequestContext } from './types';
import { BaseRequest, type RequestResult } from './base';

export class BufferRequest extends BaseRequest {
  protected createRequestOptions(
    url: string, 
    headers?: Record<string, string>,
    startPosition?: number
  ): https.RequestOptions {
    const options = super.createRequestOptions(url, headers);
    if (startPosition && startPosition > 0) {
      options.headers = {
        ...options.headers,
        'Range': `bytes=${startPosition}-`
      };
    }
    return options;
  }

  async fetchBuffer(
    url: string, 
    headers?: Record<string, string>,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<Buffer> {
    const requestOptions = this.createRequestOptions(url, headers, startPosition);
    const { data } = await this.bufferRequest(requestOptions, onProgress, writeStream, startPosition);
    return data ?? Buffer.from([]);
  }

  private async bufferRequest(
    options: https.RequestOptions,
    onProgress?: ProgressCallback,
    writeStream?: (chunk: Buffer) => Promise<void>,
    startPosition: number = 0
  ): Promise<RequestResult> {
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
} 