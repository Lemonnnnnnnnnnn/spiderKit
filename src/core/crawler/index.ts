import type { CrawlerOptions, Parser } from '../../types';
import { NtdmParser, DdysParser, TelegraphParser } from '../parsers';
import { join } from 'path';
import { runConcurrent } from '../../utils/concurrent';
import type { RequestOptions } from '../request'; 


export class Crawler {
    private parsers: Parser[] = [];
    
    constructor(options: RequestOptions = {}) {
      this.parsers.push(
        new NtdmParser(options),
        new DdysParser(options),
        new TelegraphParser(options),
      );
    }
  
    registerParser(parser: Parser) {
      this.parsers.push(parser);
    }
  
    private getParser(url: string): Parser | undefined {
      return this.parsers.find(parser => parser.match(url));
    }
  
    async crawlUrl(url: string): Promise<string> {
      const parser = this.getParser(url);
      if (!parser) {
        throw new Error(`No parser found for URL: ${url}`);
      }
      return parser.fetchHtml(url);
    }
  
    async crawl(options: CrawlerOptions) {
      try {
        const { 
          url, 
          output,
          concurrentRequests = 1,
          concurrentDownloads = 1
        } = options;
  
        const urls = Array.isArray(url) ? url : [url];
        const htmlContents = await runConcurrent(
          urls,
          url => this.crawlUrl(url),
          concurrentRequests
        );
  
        const results = await Promise.all(
          htmlContents.map(async (html, index) => {
            const parser = this.getParser(urls[index]);
            if (!parser) {
              throw new Error(`No parser found for URL: ${urls[index]}`);
            }
            return { parser, result: await parser.parse(html) };
          })
        );
        
        // 为每个网站分别下载媒体文件
        for (const { parser, result } of results) {
          const siteTitle = result.title || 'unnamed_site';
          const siteDir = join(output, siteTitle);
          
          if (result.images && result.images.length > 0) {
            await parser.downloadBatch(
              result.images,
              siteDir,
              'images',
              concurrentDownloads
            );
          }
          
          if (result.videos && result.videos.length > 0) {
            await parser.downloadBatch(
              result.videos,
              siteDir,
              'videos',
              concurrentDownloads
            );
          }
  
          await Bun.write(
            join(siteDir, 'result.json'),
            JSON.stringify(result, null, 2)
          );
        }
  
        // 完成后清理资源
        await this.cleanup();
        
      } catch (error) {
        await this.cleanup();
        throw error;
      }
    }
  
    private async cleanup() {
      // 清理所有解析器的资源
      await Promise.all(
        this.parsers.map(parser => parser.close?.())
      );
    }
  }