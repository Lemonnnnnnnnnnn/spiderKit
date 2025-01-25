import { BaseParser } from "../base";
import type { ParseResult, FetcherType } from "../../types";
import * as cheerio from 'cheerio';
import { Request, type RequestOptions } from "../../utils/request";

export class DdysParser extends BaseParser {
    private request: Request;
    name = "ddys";
    fetcherType: FetcherType = 'playwright';

    constructor(options: RequestOptions = {}) {
        super();
        this.request = new Request(options, this.fetcherType);
    }

    async fetchHtml(url: string): Promise<string> {
        return this.request.fetchText(url);
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

} 