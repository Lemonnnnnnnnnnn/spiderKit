import * as cheerio from 'cheerio';
import { BaseParser } from '../base';
import type { ParseResult, FetcherType, MediaItem } from '../../../types';
import { Request, type RequestOptions } from '../../request';

export class TelegraphParser extends BaseParser {
    name = 'telegraph';
    fetcherType: FetcherType = 'axios';

    constructor(options: RequestOptions = {}) {
        super(options);
    }

    match(url: string): boolean {
        return url.includes('telegra.ph');
    }

    async fetchHtml(url: string): Promise<string> {
        return this.request.fetchText(url);
    }

    async parse(html: string): Promise<ParseResult> {
        this.info('开始解析页面...');
        const $ = cheerio.load(html);
        
        const title = this.parseTitle($);
        this.success(`解析到标题: ${title}`);

        const images = this.parseImages($);
        this.success(`解析到 ${images.length} 张图片`);

        return {
            title,
            images
        };
    }

    private parseTitle($: cheerio.CheerioAPI): string {
        return $('header h1').text().trim();
    }

    private parseImages($: cheerio.CheerioAPI): MediaItem[] {
        const images: MediaItem[] = [];
        
        $('img').each((i, el) => {
            const url = $(el).attr('src');
            if (url) {
                // 确保URL是完整的
                const fullUrl = url.startsWith('http') ? url : `https://telegra.ph${url}`;
                images.push({
                    name: `image-${i + 1}`,
                    url: fullUrl
                });
            }
        });

        return images;
    }
} 