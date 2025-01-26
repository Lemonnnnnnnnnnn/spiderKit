import * as tls from 'tls';
import * as net from 'net';
import type { Fetcher, FetcherOptions } from './types';

export class RawHttpFetcher implements Fetcher {
  private options: FetcherOptions;
  private ciphers: string;
  private debug: boolean;

  constructor(options: FetcherOptions = {}) {
    this.options = options;
    this.ciphers = this.shuffleCiphers();
    this.debug = options.debug || false;
  }

  private log(message: string, ...args: any[]) {
    if (this.debug) {
      console.log(`[RawHttp] ${message}`, ...args);
    }
  }

  private error(message: string, error?: any) {
    if (this.debug) {
      if (error) {
        console.error(`[RawHttp] ❌ ${message}:`, error);
      } else {
        console.error(`[RawHttp] ❌ ${message}`);
      }
    }
  }

  private shuffleCiphers(): string {
    const defaultCiphers = tls.DEFAULT_CIPHERS.split(':');
    const shuffled = [
      defaultCiphers[0],
      defaultCiphers[2],
      defaultCiphers[1],
      ...defaultCiphers.slice(3)
    ].join(':');
    this.log('Shuffled ciphers:', shuffled);
    return shuffled;
  }

  private async createConnection(hostname: string, port: number): Promise<tls.TLSSocket> {
    let socket: net.Socket | tls.TLSSocket;

    // 如果配置了代理，先连接到代理服务器
    if (this.options.proxy) {
      this.log('Connecting to proxy:', `${this.options.proxy.host}:${this.options.proxy.port}`);
      socket = await new Promise<net.Socket>((resolve, reject) => {
        const proxySocket = net.connect({
          host: this.options.proxy!.host,
          port: this.options.proxy!.port,
          timeout: this.options.timeout || 30000
        });
        
        proxySocket.once('connect', () => {
          this.log('Connected to proxy');
          resolve(proxySocket);
        });
        proxySocket.once('error', (err) => {
          this.error('Proxy connection error', err);
          reject(err);
        });
        proxySocket.once('timeout', () => {
          this.error('Proxy connection timeout');
          proxySocket.destroy();
          reject(new Error('Proxy connection timeout'));
        });
      });

      // 发送 CONNECT 请求到代理
      const connectReq = [
        `CONNECT ${hostname}:${port} HTTP/1.1`,
        `Host: ${hostname}:${port}`,
        'Proxy-Connection: keep-alive',
        'Connection: keep-alive',
        `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`,
        '',
        ''
      ].join('\r\n');
      
      this.log('Sending CONNECT request to proxy');
      socket.write(connectReq);

      // 等待代理响应
      await new Promise((resolve, reject) => {
        let response = '';
        const proxyTimeout = setTimeout(() => {
          this.error('Proxy response timeout');
          socket.destroy();
          reject(new Error('Proxy response timeout'));
        }, this.options.timeout || 30000);

        const onData = (chunk: Buffer) => {
          response += chunk.toString();
          if (response.includes('\r\n\r\n')) {
            clearTimeout(proxyTimeout);
            socket.removeListener('data', onData);
            
            if (response.includes('200 Connection established')) {
              this.log('Proxy connection established');
              resolve(response);
            } else {
              const error = `Proxy connection failed: ${response.split('\r\n')[0]}`;
              this.error(error);
              socket.destroy();
              reject(new Error(error));
            }
          }
        };

        socket.on('data', onData);
        socket.once('error', (err) => {
          this.error('Proxy response error', err);
          clearTimeout(proxyTimeout);
          reject(err);
        });
      });
    } else {
      // 直接连接目标服务器
      this.log('Connecting directly to:', `${hostname}:${port}`);
      socket = await new Promise<net.Socket>((resolve, reject) => {
        const directSocket = net.connect({
          host: hostname,
          port: port,
          timeout: this.options.timeout || 30000
        });
        
        directSocket.once('connect', () => {
          this.log('Direct connection established');
          resolve(directSocket);
        });
        directSocket.once('error', (err) => {
          this.error('Direct connection error', err);
          reject(err);
        });
        directSocket.once('timeout', () => {
          this.error('Direct connection timeout');
          directSocket.destroy();
          reject(new Error('Direct connection timeout'));
        });
      });
    }

    // 建立 TLS 连接
    this.log('Initiating TLS handshake');
    return new Promise<tls.TLSSocket>((resolve, reject) => {
      const tlsSocket = tls.connect({
        socket: socket,
        host: hostname,
        servername: hostname,
        port: port,
        ciphers: this.ciphers,
        rejectUnauthorized: false,
        timeout: this.options.timeout || 30000,
        enableTrace: true,
      });

      const tlsTimeout = setTimeout(() => {
        this.error('TLS handshake timeout');
        tlsSocket.destroy();
        reject(new Error('TLS handshake timeout'));
      }, this.options.timeout || 30000);

      tlsSocket.once('secureConnect', () => {
        clearTimeout(tlsTimeout);
        this.log('TLS connection established');
        this.log('TLS Protocol:', tlsSocket.getProtocol());
        this.log('TLS Cipher:', tlsSocket.getCipher());
        resolve(tlsSocket);
      });

      tlsSocket.once('error', (err) => {
        this.error('TLS connection error', err);
        clearTimeout(tlsTimeout);
        reject(err);
      });

      tlsSocket.once('timeout', () => {
        this.error('TLS connection timeout');
        clearTimeout(tlsTimeout);
        tlsSocket.destroy();
        reject(new Error('TLS connection timeout'));
      });
    });
  }

  private async request(url: string, headers?: Record<string, string>): Promise<{ data: Buffer, headers: Record<string, string> }> {
    const urlObj = new URL(url);
    const port = parseInt(urlObj.port) || 443;
    
    const socket = await this.createConnection(urlObj.hostname, port);

    // 构建 HTTP 请求
    const requestHeaders = {
      'Host': urlObj.host,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Connection': 'close',
      'Accept': '*/*',
      'Accept-Encoding': 'identity',
      ...headers
    };

    const headerString = Object.entries(requestHeaders)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\r\n');

    const request = `GET ${urlObj.pathname}${urlObj.search} HTTP/1.1\r\n${headerString}\r\n\r\n`;
    socket.write(request);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      let responseHeaders: Record<string, string> = {};
      let headersParsed = false;
      let responseTimeout: NodeJS.Timeout;

      const cleanup = () => {
        clearTimeout(responseTimeout);
        socket.destroy();
      };

      const resetTimeout = () => {
        clearTimeout(responseTimeout);
        responseTimeout = setTimeout(() => {
          cleanup();
          reject(new Error('Response timeout'));
        }, this.options.timeout || 30000) as NodeJS.Timeout;
      };

      resetTimeout();

      socket.on('data', (chunk) => {
        resetTimeout();

        if (!headersParsed) {
          const data = chunk.toString();
          const headerEndIndex = data.indexOf('\r\n\r\n');
          
          if (headerEndIndex !== -1) {
            const headers = data.substring(0, headerEndIndex);
            const [statusLine, ...headerLines] = headers.split('\r\n');
            const [, statusCode] = statusLine.split(' ');

            if (parseInt(statusCode) >= 400) {
              cleanup();
              reject(new Error(`HTTP ${statusCode}`));
              return;
            }

            headerLines.forEach((line: string) => {
              const [key, ...values] = line.split(': ');
              responseHeaders[key.toLowerCase()] = values.join(': ');
            });

            // 处理重定向
            if ([301, 302, 303, 307, 308].includes(parseInt(statusCode))) {
              const location = responseHeaders['location'];
              if (location) {
                cleanup();
                this.fetchBuffer(location, headers)
                  .then(buffer => resolve({ data: buffer, headers: responseHeaders }))
                  .catch(reject);
                return;
              }
            }

            headersParsed = true;
            const bodyStart = headerEndIndex + 4;
            if (chunk.length > bodyStart) {
              chunks.push(chunk.subarray(bodyStart));
            }
          }
        } else {
          chunks.push(chunk);
        }
      });

      socket.once('end', () => {
        cleanup();
        const data = Buffer.concat(chunks);
        resolve({ data, headers: responseHeaders });
      });

      socket.once('error', (error) => {
        cleanup();
        reject(error);
      });
    });
  }

  async fetchText(url: string, headers?: Record<string, string>): Promise<string> {
    const { data } = await this.request(url, headers);
    return data.toString('utf-8');
  }

  async fetchBuffer(url: string, headers?: Record<string, string>): Promise<Buffer> {
    const { data } = await this.request(url, headers);
    return data;
  }

  async close(): Promise<void> {
    // 无需实现关闭逻辑，因为每个请求都会关闭自己的连接
  }
} 