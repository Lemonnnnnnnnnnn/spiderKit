import { mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { Request, type RequestOptions } from '../request';
import { runConcurrent } from '../../utils/concurrent';
import type { Parser, ParseResult, FetcherType, MediaItem } from '../../types';

export abstract class BaseParser implements Parser {
    protected request: Request;
    protected downloadRequest: Request; // 专门用于下载的 request
    abstract name: string;
    abstract fetcherType: FetcherType;

    constructor(options: RequestOptions = {}) {
        this.request = new Request(options);
        this.downloadRequest = new Request(options, 'axios'); // 下载始终使用 axios
    }

    abstract parse(html: string): Promise<ParseResult>;
    abstract match(url: string): boolean;
    abstract fetchHtml(url: string): Promise<string>;

    // 添加下载相关方法
    async downloadMedia(item: MediaItem, destPath: string): Promise<void> {
        try {
            this.info(`开始下载: ${item.name}`);
            const buffer = await this.downloadRequest.fetchBuffer(item.url);
            await mkdir(dirname(destPath), { recursive: true });
            await Bun.write(destPath, buffer);
            this.success(`下载完成: ${destPath}`);
        } catch (error) {
            this.error(`下载失败: ${item.name}`, error);
            throw error;
        }
    }

    async downloadBatch(
        items: MediaItem[],
        outputDir: string,
        type: string,
        concurrent: number
    ): Promise<void> {
        this.info(`\n开始下载 ${type}...`);
        this.info(`共 ${items.length} 个文件，并发数 ${concurrent}`);

        let completed = 0;
        const downloadItem = async (item: MediaItem) => {
            const ext = extname(item.url) || this.getDefaultExtension(type);
            const filename = `${item.name}${ext}`;
            const destPath = join(outputDir, type, filename);
            await this.downloadMedia(item, destPath);
            completed++;
            this.info(`进度: ${completed}/${items.length}`);
            return destPath;
        };

        try {
            await runConcurrent(items, downloadItem, concurrent);
            this.success(`\n${type} 下载完成！`);
        } catch (error) {
            this.error(`\n${type} 下载过程中出现错误:`, error);
            throw error;
        }
    }

    protected getDefaultExtension(type: string): string {
        switch (type) {
            case 'videos':
                return '.mp4';
            case 'images':
                return '.jpg';
            default:
                return '';
        }
    }

    protected log(message: string) {
        console.log(`[${this.name}] ${message}`);
    }

    protected warn(message: string) {
        console.warn(`[${this.name}] ⚠️ ${message}`);
    }

    protected error(message: string, error?: any) {
        if (error) {
            console.error(`[${this.name}] ❌ ${message}:`, error);
        } else {
            console.error(`[${this.name}] ❌ ${message}`);
        }
    }

    protected info(message: string) {
        console.info(`[${this.name}] ℹ️ ${message}`);
    }

    protected success(message: string) {
        console.log(`[${this.name}] ✅ ${message}`);
    }

    async close(): Promise<void> {
        await Promise.all([
            this.request.close(),
            this.downloadRequest.close()
        ]);
    }
}