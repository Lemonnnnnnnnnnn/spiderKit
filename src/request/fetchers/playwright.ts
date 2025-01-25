import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import type { Fetcher, FetcherOptions } from './types';

export class PlaywrightFetcher implements Fetcher {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private pages: Map<string, Page> = new Map();

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
        headless: false,
      });
      
      const contextOptions: any = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      };

      if (this.options.proxy) {
        contextOptions.proxy = {
          server: `${this.options.proxy.protocol || 'http'}://${this.options.proxy.host}:${this.options.proxy.port}`,
          bypass: '<-loopback>'
        };
      }
      
      this.context = await this.browser.newContext(contextOptions);
    }
  }

  /**
   * 获取页面的基础方法
   * @param url 要访问的URL
   * @param pageId 可选的页面标识符，如果提供则保持页面打开
   * @returns [页面实例, 清理函数]
   */
  private async getPage(url: string, pageId?: string): Promise<[Page, () => Promise<void>]> {
    await this.initialize();
    
    if (pageId && this.pages.has(pageId)) {
      const page = this.pages.get(pageId)!;
      return [page, async () => {}];
    }

    const page = await this.context!.newPage();
    try {
      // 设置更宽松的超时策略
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(60000);

      // 拦截和阻止不必要的资源加载
      await page.route('**/*', async (route) => {
        const request = route.request();
        const resourceType = request.resourceType();
        
        // 只允许文档、脚本、XHR和获取请求
        if (['document', 'script', 'xhr', 'fetch'].includes(resourceType)) {
          await route.continue();
        } else {
          await route.abort();
        }
      });

      // 使用 domcontentloaded 而不是 networkidle
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.options.timeout || 60000
      });

      // 等待页面主要内容加载
      await page.waitForSelector('article', {
        timeout: this.options.timeout || 60000
      }).catch(() => {
        // 如果找不到特定元素，也继续执行
        this.log('Warning: Article selector not found');
      });

      if (pageId) {
        this.pages.set(pageId, page);
        return [page, async () => {}];
      }

      return [page, async () => await page.close()];
    } catch (error) {
      await page.close();
      throw new Error(`Failed to get page ${url}: ${error}`);
    }
  }

  private log(message: string) {
    console.log(`[PlaywrightFetcher] ${message}`);
  }

  async fetchText(url: string): Promise<string> {
    const [page, cleanup] = await this.getPage(url);
    try {
      const content = await page.content();
      await cleanup();
      return content;
    } catch (error) {
      await cleanup();
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }

  async fetchBuffer(url: string): Promise<Buffer> {
    const [page, cleanup] = await this.getPage(url);
    try {
      const response = await page.goto(url, {
        timeout: this.options.timeout || 30000,
        waitUntil: 'networkidle'
      });
      const buffer = await response!.body();
      await cleanup();
      return buffer;
    } catch (error) {
      await cleanup();
      throw new Error(`Failed to fetch buffer from ${url}: ${error}`);
    }
  }

  /**
   * 打开页面并保持打开状态
   * @param url 要访问的URL
   * @param pageId 页面标识符
   * @returns 
   */
  async openPage(url: string, pageId: string): Promise<Page> {
    const [page] = await this.getPage(url, pageId);
    return page;
  }

  /**
   * 在指定页面上执行JavaScript代码
   * @param pageId 页面标识符
   * @param script 要执行的函数或脚本
   * @param args 传递给脚本的参数
   * @returns 
   */
  async evaluateScript<T>(pageId: string, script: Function, ...args: any[]): Promise<T> {
    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`No page found with id: ${pageId}`);
    }

    try {
      return await page.evaluate(script as any, ...args);
    } catch (error) {
      throw new Error(`Failed to evaluate script: ${error}`);
    }
  }

  /**
   * 关闭指定的页面
   * @param pageId 页面标识符
   */
  async closePage(pageId: string): Promise<void> {
    const page = this.pages.get(pageId);
    if (page) {
      await page.close();
      this.pages.delete(pageId);
    }
  }

  async close(): Promise<void> {
    // 关闭所有打开的页面
    for (const page of this.pages.values()) {
      await page.close();
    }
    this.pages.clear();

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }

  async getPageById(pageId: string): Promise<Page> {
    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`No page found with id: ${pageId}`);
    }
    return page;
  }
} 