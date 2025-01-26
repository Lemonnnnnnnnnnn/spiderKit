export interface CrawlerOptions {
    url: string;
    parser?: string;
    output: string;
    concurrentRequests?: number;  // 并发爬取数量
    concurrentDownloads?: number; // 并发下载数量  
}
  
export type FetcherType = 'axios' | 'playwright' | 'tls';

export interface Parser {
  name: string;
  fetcherType: FetcherType;
  parse(html: string): Promise<ParseResult>;
  match(url: string): boolean;
  fetchHtml(url: string): Promise<string>;
  downloadMedia(item: MediaItem, outputDir: string): Promise<void>;
  downloadBatch(
    items: MediaItem[],
    outputDir: string,
    type: string,
    concurrent: number
  ): Promise<void>;
  close?(): Promise<void>;  // 添加可选的关闭方法
}
  
export interface ParseResult {
  title?: string;
  content?: string;
  images?: MediaItem[];
  videos?: MediaItem[]; 
  [key: string]: any;
}

export interface MediaItem {
  name: string;
  url: string;
}