import * as cheerio from 'cheerio';
import type { ParseResult } from '../../types';
import { BaseParser } from '../base';
import { getVideoInfo } from './contexts/play';

export class NtdmParser extends BaseParser {
  name = 'ntdm';
  
  match(url: string): boolean {
    return url.includes('ntdm');
  }
  
  async parse(html: string): Promise<ParseResult> {
    const $ = cheerio.load(html);
    const urls = parseEpisodeUrl(html)
    await parseEpisodeVideo(urls[0])
    
    return {
      title: $('title').text(),
      content: $('.content').text(),
      images : [],
      videos : [],
    };
  }
}

function parseTitle(html: string) {
    const $ = cheerio.load(html);

    let title = $('#detailname > a').text()

    return title
}

function parseEpisodeUrl(html: string) {
    const $ = cheerio.load(html);

    let urls = $('#main0 > div:nth-child(1) > ul > li > a')
        .map((i, el) => $(el)
        .attr('href'))
        .get()
        .map((url) => `https://www.ntdm9.com${url}`)

    return urls
}

async function parseEpisodeVideo(url: string) {
    const html = await fetch(url).then(res=> res.text())
    
    parseVideoInfo(html)
}

function parseVideoInfo(html: string) {
    const $ = cheerio.load(html);

    const videoScript = $('#ageframediv > script:nth-child(1)').text()

    const json = videoScript.match(/player_aaaa=(.*)/)?.[1]

    const player_aaaa = JSON.parse(json || '{}')

    const yhdmUrl = player_aaaa.url
    
    parseYhdmUrl(`https://danmu.yhdmjx.com/m3u8.php?url=${yhdmUrl}`)
}


async function parseYhdmUrl(url : string) { 
    const html = await fetch(url).then(res=> res.text())

    const bt_token = parseBtToken(html)
    const key = parseEncodedKey(html)

    const videoUrl = getVideoInfo(key,bt_token);

    console.log({videoUrl})

    return videoUrl
} 

function parseBtToken(html: string) { 
    const btToken = html.match(/bt_token = "(.*)"/)?.[1]
    return btToken
}

function parseEncodedKey(html: string) { 
    const encodedKey = html.match(/"url": getVideoInfo\(\"(.*)\"\)/)?.[1];
    return encodedKey
}

