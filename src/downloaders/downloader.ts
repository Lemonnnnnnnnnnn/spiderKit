import { mkdir, writeFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import type { MediaItem, Downloader } from '../types';
import { runConcurrent } from '../utils/concurrent';

export class FileDownloader implements Downloader {
  async download(item: MediaItem, destPath: string): Promise<void> {
    const response = await fetch(item.url);
    const buffer = await response.arrayBuffer();
    
    await mkdir(dirname(destPath), { recursive: true });
    await writeFile(destPath, Buffer.from(buffer));
  }
  
  async downloadBatch(
    items: MediaItem[], 
    outputDir: string, 
    type: string,
    siteTitle: string,
    concurrent: number
  ): Promise<void> {
    // 创建基于网站标题的目录
    const siteDir = this.sanitizePath(siteTitle);
    
    const downloadItem = async (item: MediaItem) => {
      const ext = extname(item.url) || this.getDefaultExtension(type);
      const filename = `${item.name}${ext}`;
      // 构建路径: output/网站标题/类型/文件名
      const destPath = join(outputDir, siteDir, type, filename);
      await this.download(item, destPath);
      return destPath;
    };
    
    await runConcurrent(items, downloadItem, concurrent);
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