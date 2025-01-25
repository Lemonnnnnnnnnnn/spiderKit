import type { CrawlerOptions, Parser, MediaItem } from './types';
import { NtdmParser } from './parsers/ntdm';
import { DdysParser } from './parsers/ddys';
import { join } from 'path';
import { runConcurrent } from './utils/concurrent';
import type { RequestOptions } from './request';

export class Crawler {
  private parsers: Parser[] = [];
  
  constructor(options: RequestOptions = {}) {
    this.parsers.push(
      new NtdmParser(options),
      new DdysParser(options)
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
  }
}