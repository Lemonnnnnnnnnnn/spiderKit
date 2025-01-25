import { chromium, type Browser, type BrowserContext } from 'playwright';
import type { Fetcher, FetcherOptions } from './types';

export class PlaywrightFetcher implements Fetcher {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  constructor(private options: FetcherOptions = {}) {}

  private async initialize() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
        ],
        timeout: 60000,
        headless: true,
      });
      
      const contextOptions: any = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      };

      if (this.options.proxy) {
        contextOptions.proxy = {
          server: `${this.options.proxy.protocol}://${this.options.proxy.host}:${this.options.proxy.port}`,
        };
      }
      
      this.context = await this.browser.newContext(contextOptions);
    }
  }

  async fetchText(url: string): Promise<string> {
    await this.initialize();
    const page = await this.context!.newPage();
    try {
      await page.goto(url);
      
      
      const content = await page.content();
      await page.close();
      return content;
    } catch (error) {
      await page.close();
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }

  async fetchBuffer(url: string): Promise<Buffer> {
    await this.initialize();
    const page = await this.context!.newPage();
    try {
      const response = await page.goto(url, {
        timeout: this.options.timeout || 30000,
        waitUntil: 'networkidle'
      });
      const buffer = await response!.body();
      await page.close();
      return buffer;
    } catch (error) {
      await page.close();
      throw new Error(`Failed to fetch buffer from ${url}: ${error}`);
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }
} 