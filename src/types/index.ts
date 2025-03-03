export interface CrawlerOptions {
    url: string;
    parser?: string;
    output: string;
    concurrentRequests?: number;  // 并发爬取数量
    concurrentDownloads?: number; // 并发下载数量  
}
  
export interface Parser {
  name: string;
  parse(html: string): Promise<ParseResult>;
  match(url: string): boolean;
  fetchHtml(url: string): Promise<string>;
  downloadMedia(item: MediaItem, destPath: string): Promise<Buffer>;
  downloadBatch(
    items: MediaItem[],
    outputDir: string,
    type: string,
    concurrent: number
  ): Promise<void>;
  close?(): Promise<void>;
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
