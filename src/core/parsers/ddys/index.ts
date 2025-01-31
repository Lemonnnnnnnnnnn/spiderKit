import { BaseParser } from "../base";
import type { ParseResult, FetcherType, MediaItem } from "../../../types";
import * as cheerio from 'cheerio';
import { Request, type RequestOptions } from '../../request';
import { mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { dirname } from 'path'; 
import { DownloadFormatter } from '../../../utils/format';


export class DdysParser extends BaseParser {
    protected request: Request;
    protected downloadRequest: Request;
    name = "ddys";
    fetcherType: FetcherType = 'raw-http';
    protected formatter: DownloadFormatter;

    constructor(options: RequestOptions = {}) {
        super();
        this.request = new Request(options, this.fetcherType);
        this.downloadRequest = new Request(options, this.fetcherType);
        this.formatter = new DownloadFormatter();
    }

    async fetchHtml(url: string): Promise<string> {
        const headers = {
            'Referer': 'https://ddys.pro/',
            'Origin': 'https://ddys.pro'
        };
        return this.request.fetchText(url, headers);
    }

    match(url: string): boolean {
        // 匹配逻辑...
        return url.includes("ddys"); // 示例匹配条件
    }

    async parse(html: string): Promise<ParseResult> {
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

    async downloadMedia(item: MediaItem, destPath: string): Promise<Buffer> {
        try {
            this.info(`开始下载: ${item.name}`);
            const headers = {
                'Referer': 'https://ddys.pro/',
                'Origin': 'https://ddys.pro'
            };
            
            let lastLogged = 0;
            const startTime = Date.now();

            // 确保目标目录存在
            await mkdir(dirname(destPath), { recursive: true });
            
            // 创建写入流
            const writeStream = createWriteStream(destPath);
            
            await this.downloadRequest.fetchBuffer(
                item.url, 
                headers,
                (downloaded, total) => {
                    const now = Date.now();
                    if (now - lastLogged >= 1000) {
                        const speed = (downloaded / (1024 * 1024)) / ((now - startTime) / 1000);
                        this.info(
                            `${item.name} - ` + 
                            this.formatter.formatProgress(downloaded, total, speed)
                        );
                        lastLogged = now;
                    }
                },
                async (chunk) => {
                    return new Promise((resolve, reject) => {
                        writeStream.write(chunk, (error) => {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
                }
            );
            
            // 关闭写入流
            await new Promise((resolve, reject) => {
                writeStream.end((error: any) => {
                    if (error) reject(error);
                    else resolve(null);
                });
            });
            
            this.success(`下载完成: ${destPath}`);
            return Buffer.from([]); 
        } catch (error) {
            this.error(`下载失败: ${item.name}`, error);
            throw error;
        }
    }
} 