import { mkdir, writeFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import type { MediaItem, Downloader } from '../types';
import { runConcurrent } from '../utils/concurrent';
import { Request, type RequestOptions } from '../utils/request';

export class FileDownloader implements Downloader {
  private request: Request;

  constructor(options: RequestOptions = {}) {
    this.request = new Request(options);
  }

  async download(item: MediaItem, destPath: string): Promise<void> {
    try {
      console.log(`开始下载: ${item.name}`);
      const buffer = await this.request.fetchBuffer(item.url);
      await mkdir(dirname(destPath), { recursive: true });
      await writeFile(destPath, buffer);
      console.log(`下载完成: ${destPath}`);
    } catch (error) {
      console.error(`下载失败: ${item.name}`, error);
      throw error;
    }
  }
  
  async downloadBatch(
    items: MediaItem[], 
    outputDir: string, 
    type: string,
    siteTitle: string,
    concurrent: number
  ): Promise<void> {
    console.log(`\n开始下载 ${siteTitle} 的 ${type}...`);
    console.log(`共 ${items.length} 个文件，并发数 ${concurrent}`);
    
    // 创建基于网站标题的目录
    const siteDir = this.sanitizePath(siteTitle);
    let completed = 0;
    
    const downloadItem = async (item: MediaItem) => {
      const ext = extname(item.url) || this.getDefaultExtension(type);
      const filename = `${item.name}${ext}`;
      // 构建路径: output/网站标题/类型/文件名
      const destPath = join(outputDir, siteDir, type, filename);
      await this.download(item, destPath);
      completed++;
      console.log(`进度: ${completed}/${items.length}`);
      return destPath;
    };
    
    try {
      await runConcurrent(items, downloadItem, concurrent);
      console.log(`\n${siteTitle} 的 ${type} 下载完成！`);
    } catch (error) {
      console.error(`\n${siteTitle} 的 ${type} 下载过程中出现错误:`, error);
      throw error;
    }
  }
  
  private getDefaultExtension(type: string): string {
    switch (type) {
      case 'images':
        return '.jpg';
      case 'videos':
        return '.mp4';
      default:
        return '';
    }
  }

  // 处理文件路径中的非法字符
  private sanitizePath(path: string): string {
    return path
      .replace(/[<>:"/\\|?*]/g, '_') // 替换Windows文件系统不允许的字符
      .replace(/\s+/g, '_')          // 替换空格为下划线
      .trim();
  }
}