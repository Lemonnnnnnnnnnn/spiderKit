import { BaseParser } from "../base";
import type { ParseResult } from "../../types";
import * as cheerio from 'cheerio';

export class DdysParser extends BaseParser {
    name = "ddys";

    match(url: string): boolean {
        // 匹配逻辑...
        return url.includes("ddys"); // 示例匹配条件
    }

    async parse(html: string): Promise<ParseResult> {
        this.info('开始解析页面...');
        const title = this.parseTitle(html);
        this.success(`解析到标题: ${title}`);

        const videoUrls = this.parseEpisodeVideo(html);
        console.log(videoUrls)
        
        // const urls = this.parseEpisodeUrl(html);
        // this.info(`解析到 ${urls.length} 个剧集链接`);
        
        // this.info('开始获取视频URL...');
        // const videoUrls = await Promise.all(
        //     urls.map(async (url, index) => {
        //         this.log(`[${index + 1}/${urls.length}] 正在解析: ${url}`);
        //         return this.parseEpisodeVideo(url);
        //     })
        // );

        // const videos = videoUrls
        //     .map((url, index) => url ? {
        //         name: `${title}-${index + 1}`,
        //         url: url
        //     } : null)
        //     .filter((video): video is NonNullable<typeof video> => video !== null);

        // this.success(`成功解析 ${videos.length}/${urls.length} 个视频URL`);
        // return { title, videos };
        return { title, videos: [] };
    }

    parseTitle(html: string): string {
        const $ = cheerio.load(html);
        return $('article > div.post-content > h1').text();
    }

    // parseEpisodeUrl(html: string): string[] {
    //     const $ = cheerio.load(html);
    //     const urls = $('a[href^="/video/"]').map((i, el) => $(el).attr('href')).get();
    //     return urls.map(url => `https://www.ddys.com${url}`);
    // }

    parseEpisodeVideo(html: string) {
        const $ = cheerio.load(html);
        const script = $('.wp-playlist-script').text();
        const json = JSON.parse(script);
        return json.tracks.map((item: any) => item.src0);
    }

} 