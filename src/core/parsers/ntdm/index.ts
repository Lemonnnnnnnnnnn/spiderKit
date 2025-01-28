import * as cheerio from 'cheerio';
import type { ParseResult, FetcherType, MediaItem } from '../../../types';
import { BaseParser } from '../base';
import { getVideoInfo } from './contexts/play';
import { Request, type RequestOptions } from '../../request'; 


export class NtdmParser extends BaseParser {
    protected request: Request;
    name = 'ntdm';
    fetcherType: FetcherType = 'axios';
  
    constructor(options: RequestOptions = {}) {
      super();
      this.request = new Request(options, this.fetcherType);
    }
    
    async fetchHtml(url: string): Promise<string> {
      return this.request.fetchText(url);
    }
    
    match(url: string): boolean {
      return url.includes('ntdm');
    }
    
    async parse(html: string): Promise<ParseResult> {
      this.info('开始解析页面...');
      const title = this.parseTitle(html);
      this.success(`解析到标题: ${title}`);
      
      const urls = this.parseEpisodeUrl(html);
      this.info(`解析到 ${urls.length} 个剧集链接`);
      
      this.info('开始获取视频URL...');
      const videoUrls = await Promise.all(
        urls.map(async (url, index) => {
          this.log(`[${index + 1}/${urls.length}] 正在解析: ${url}`);
          return this.parseEpisodeVideo(url);
        })
      );
      
      const videos = videoUrls
        .map((url, index) => url ? {
          name: `${title}-${index + 1}`,
          url: url
        } : null)
        .filter((video): video is NonNullable<typeof video> => video !== null);
      
      this.success(`成功解析 ${videos.length}/${urls.length} 个视频URL`);
      
      return {
        title,
        videos,
      };
    }
  
    private parseTitle(html: string) {
      const $ = cheerio.load(html);
      return $('#detailname > a').text();
    }
  
    private parseEpisodeUrl(html: string) {
      const $ = cheerio.load(html);
      return $('#main0 > div:nth-child(1) > ul > li > a')
        .map((i, el) => $(el).attr('href'))
        .get()
        .map((url) => `https://www.ntdm9.com${url}`);
    }
  
    private async parseEpisodeVideo(url: string) {
      try {
        const html = await this.request.fetchText(url);
        return this.parseVideoInfo(html);
      } catch (error) {
        this.error(`解析视频失败: ${url}`, error);
        return null;
      }
    }
  
    private parseVideoInfo(html: string) {
      try {
        const $ = cheerio.load(html);
        const videoScript = $('#ageframediv > script:nth-child(1)').text();
        const json = videoScript.match(/player_aaaa=(.*)/)?.[1];
        if (!json) {
          this.warn('未找到 player_aaaa 信息');
          return null;
        }
        
        const player_aaaa = JSON.parse(json || '{}');
        const yhdmUrl = player_aaaa.url;
        if (!yhdmUrl) {
          this.warn('未找到视频URL');
          return null;
        }
        
        return this.parseYhdmUrl(`https://danmu.yhdmjx.com/m3u8.php?url=${yhdmUrl}`);
      } catch (error) {
        this.error('解析视频信息失败', error);
        return null;
      }
    }
  
    private async parseYhdmUrl(url: string) { 
      try {
        const html = await this.request.fetchText(url);
        const bt_token = this.parseBtToken(html);
        const key = this.parseEncodedKey(html);
        
        if (!bt_token || !key) {
          this.warn('未找到必要的解密信息');
          return null;
        }
        
        const videoUrl = getVideoInfo(key, bt_token) as string;
        return videoUrl;
      } catch (error) {
        this.error('解析最终视频URL失败', error);
        return null;
      }
    }
  
    private parseBtToken(html: string) { 
      return html.match(/bt_token = "(.*)"/)?.[1];
    }
  
    private parseEncodedKey(html: string) { 
      return html.match(/"url": getVideoInfo\(\"(.*)\"\)/)?.[1];
    }
  }
  
  