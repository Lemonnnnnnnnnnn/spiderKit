import type { CrawlerOptions, Parser, Downloader, MediaItem } from './types';
import { NtdmParser } from './parsers/ntdm';
import { FileDownloader } from './downloaders/downloader';
import { join } from 'path';
import { runConcurrent } from './utils/concurrent';
import { Request } from './utils/request';
import type { RequestOptions } from './utils/request';

export class Crawler {
  private parsers: Parser[] = [];
  private downloader: Downloader;
  private request: Request;
  
  constructor(options: RequestOptions & { useBrowser?: boolean } = {}) {
    const { useBrowser, ...requestOptions } = options;
    this.parsers.push(new NtdmParser(requestOptions));
    this.downloader = new FileDownloader(requestOptions);
    this.request = new Request(requestOptions, useBrowser);
  }

  registerParser(parser: Parser) {
    this.parsers.push(parser);
  }

  private getParser(url: string): Parser | undefined {
    return this.parsers.find(parser => parser.match(url));
  }

  async crawlUrl(url: string): Promise<string> {
    return this.request.fetchText(url);
  }

  async crawl(options: CrawlerOptions) {
    const { 
      url, 
      output,
      concurrentRequests = 1,
      concurrentDownloads = 1
    } = options;

    // 如果是多个URL，可以并发爬取
    const urls = Array.isArray(url) ? url : [url];
    const htmlContents = await runConcurrent(
      urls,
      url => this.crawlUrl(url),
      concurrentRequests
    );

    // 解析所有内容
    const results = await Promise.all(
      htmlContents.map(async (html, index) => {
        const parser = this.getParser(urls[index]);
        if (!parser) {
          throw new Error(`No parser found for URL: ${urls[index]}`);
        }
        return parser.parse(html);
      })
    );
    
    // 为每个网站分别下载媒体文件
    for (const result of results) {
      const siteTitle = result.title || 'unnamed_site';
      
      if (result.images && result.images.length > 0) {
        await this.downloader.downloadBatch(
          result.images,
          output,
          'images',
          siteTitle,
          concurrentDownloads
        );
      }
      
      if (result.videos && result.videos.length > 0) {
        await this.downloader.downloadBatch(
          result.videos,
          output,
          'videos',
          siteTitle,
          concurrentDownloads
        );
      }

      // 为每个网站创建单独的结果文件
      await Bun.write(
        join(output, siteTitle, 'result.json'),
        JSON.stringify(result, null, 2)
      );
    }
    
    // 保存总体结果
    // await Bun.write(
    //   join(output, 'all_results.json'),
    //   JSON.stringify(results, null, 2)
    // );
  }
}