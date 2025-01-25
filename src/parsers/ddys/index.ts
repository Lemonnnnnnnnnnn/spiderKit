import { BaseParser } from "../base";
import type { ParseResult, FetcherType, MediaItem } from "../../types";
import * as cheerio from 'cheerio';
import { Request, type RequestOptions, type PlaywrightRequest } from '../../request';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

export class DdysParser extends BaseParser {
    protected request: PlaywrightRequest;
    protected downloadRequest: Request;
    protected currentPageId?: string;
    name = "ddys";
    fetcherType: FetcherType = 'playwright';

    constructor(options: RequestOptions = {}) {
        super();
        this.request = new Request(options, this.fetcherType) as PlaywrightRequest;
        this.downloadRequest = new Request(options, 'axios');
    }

    async fetchHtml(url: string): Promise<string> {
        this.currentPageId = `ddys_${Date.now()}`;
        this.info(`创建新页面，ID: ${this.currentPageId}`);
        
        const page = await this.request.fetcher.openPage(url, this.currentPageId);
        return page.content();
    }

    match(url: string): boolean {
        // 匹配逻辑...
        return url.includes("ddys"); // 示例匹配条件
    }

    async parse(html: string): Promise<ParseResult> {
        try {
            this.info(`开始解析，当前页面ID: ${this.currentPageId}`);
            
            // 设置进度回调
            if (this.currentPageId) {
                await this.request.fetcher.evaluateScript(
                    this.currentPageId,
                    (callback: string) => {
                        // @ts-ignore
                        window._reportProgress = (progress: number, received: number, total: number) => {
                            console.log(`下载进度: ${progress}% (${received}/${total} bytes)`);
                        };
                    }
                );
            }

            this.info('开始解析页面...');
            const title = this.parseTitle(html);
            this.success(`解析到标题: ${title}`);

            const videoUrls = this.parseEpisodeVideo(html);
            
            const videos = videoUrls
                .map((url, index) => url ? {
                    name: `${title}-${index + 1}`,
                    url: url
                } : null)
                .filter((video): video is NonNullable<typeof video> => video !== null);

            this.success(`成功解析 ${videos.length}/${videoUrls.length} 个视频URL`);
            return { title, videos };
        } finally {
            this.info(`解析完成，页面ID: ${this.currentPageId} 保持打开状态`);
        }
    }

    parseTitle(html: string): string {
        const $ = cheerio.load(html);
        return $('article > div.post-content > h1').text();
    }

    parseEpisodeVideo(html: string) {
        try { 
            const $ = cheerio.load(html);
            const script = $('.wp-playlist-script').text();
            const json = JSON.parse(script);
            return json.tracks.map((item: any) => `https://v.ddys.pro${item.src0}`) as string[];
        } catch (error) {
            this.error(`解析视频URL失败: ${error}`);
            return [];
        }
    }

    async downloadMedia(item: MediaItem, destPath: string): Promise<void> {
        try {
            this.info(`开始下载: ${item.name}, 当前页面ID: ${this.currentPageId}`);
            
            if (!this.currentPageId) {
                this.error('No active page found. Please ensure fetchHtml is called first.');
                throw new Error('No active page found. Please ensure fetchHtml is called first.');
            }

            // 创建文件目录
            await mkdir(dirname(destPath), { recursive: true });
            const writeStream = Bun.file(destPath).writer();

            // 设置数据处理回调
            const handleChunk = (chunk: number[]) => {
                writeStream.write(new Uint8Array(chunk));
            };

            // 在页面中设置回调函数
            await this.request.fetcher.evaluateScript(
                this.currentPageId,
                () => {
                    // @ts-ignore
                    window._chunkCallback = function(chunk) {
                        // @ts-ignore
                        window._handleChunkCallback(chunk);
                    };
                }
            );

            // 注册回调处理函数
            const page = await this.request.fetcher.getPageById(this.currentPageId);
            await page.exposeFunction('_handleChunkCallback', handleChunk);

            // 开始下载
            await this.request.fetcher.evaluateScript(
                this.currentPageId,
                async (url: string) => {
                    const response = await fetch(url, {
                        headers: {
                            'Referer': 'https://ddys.pro/',
                            'Origin': 'https://ddys.pro'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const reader = response.body!.getReader();
                    const contentLength = parseInt(response.headers.get('Content-Length') || '0');
                    let receivedLength = 0;
                    
                    while(true) {
                        const {done, value} = await reader.read();
                        
                        if (done) {
                            break;
                        }
                        
                        // 直接传递 Uint8Array 数据
                        // @ts-ignore
                        window._chunkCallback(Array.from(value));
                        receivedLength += value.length;
                        
                        // 计算并报告进度
                        const progress = contentLength ? 
                            Math.round((receivedLength / contentLength) * 100) : 0;
                        
                        // @ts-ignore
                        window._reportProgress?.(progress, receivedLength, contentLength);
                    }
                },
                item.url
            );

            await writeStream.end();
            this.success(`下载完成: ${destPath}`);
        } catch (error) {
            this.error(`下载失败: ${item.name}, 页面ID: ${this.currentPageId}`, error);
            throw error;
        }
    }

    async cleanup(): Promise<void> {
        if (this.currentPageId) {
            this.info(`清理页面，ID: ${this.currentPageId}`);
            await this.request.fetcher.closePage(this.currentPageId);
            this.currentPageId = undefined;
            this.info('页面已关闭');
        } else {
            this.info('没有需要清理的页面');
        }
    }
}