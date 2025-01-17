import * as cheerio from 'cheerio';
import type { ParseResult } from '../../types';
import { BaseParser } from '../base';
import { getVideoInfo } from './contexts/play';
import { Request, type RequestOptions } from '../../utils/request';

export class NtdmParser extends BaseParser {
  private request: Request;
  name = 'ntdm';

  constructor(options: RequestOptions = {}) {
    super();
    this.request = new Request(options);
  }
  
  match(url: string): boolean {
    return url.includes('ntdm');
  }
  
  async parse(html: string): Promise<ParseResult> {
    const $ = cheerio.load(html);
    const urls = this.parseEpisodeUrl(html);
    await this.parseEpisodeVideo(urls[0]);
    
    return {
      title: $('title').text(),
      content: $('.content').text(),
      images: [],
      videos: [],
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
    const html = await this.request.fetchText(url);
    return this.parseVideoInfo(html);
  }

  private parseVideoInfo(html: string) {
    const $ = cheerio.load(html);
    const videoScript = $('#ageframediv > script:nth-child(1)').text();
    const json = videoScript.match(/player_aaaa=(.*)/)?.[1];
    const player_aaaa = JSON.parse(json || '{}');
    const yhdmUrl = player_aaaa.url;
    
    return this.parseYhdmUrl(`https://danmu.yhdmjx.com/m3u8.php?url=${yhdmUrl}`);
  }

  private async parseYhdmUrl(url: string) { 
    const html = await this.request.fetchText(url);
    const bt_token = this.parseBtToken(html);
    const key = this.parseEncodedKey(html);
    const videoUrl = getVideoInfo(key, bt_token);
    console.log({videoUrl});
    return videoUrl;
  }

  private parseBtToken(html: string) { 
    return html.match(/bt_token = "(.*)"/)?.[1];
  }

  private parseEncodedKey(html: string) { 
    return html.match(/"url": getVideoInfo\(\"(.*)\"\)/)?.[1];
  }
}

