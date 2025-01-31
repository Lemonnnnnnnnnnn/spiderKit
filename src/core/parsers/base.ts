import { mkdir, stat } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { Request, type RequestOptions } from '../request';
import { runConcurrent } from '../../utils/concurrent';
import type { Parser, ParseResult, FetcherType, MediaItem } from '../../types';
import { DownloadFormatter } from '../../utils/format';
import { logger } from '../../utils/logger';

export abstract class BaseParser implements Parser {
    protected request: Request;
    protected downloadRequest: Request; // 专门用于下载的 request
    abstract name: string;
    abstract fetcherType: FetcherType;
    protected formatter: DownloadFormatter;

    constructor(options: RequestOptions = {}) {
        this.request = new Request(options);
        this.downloadRequest = new Request(options, 'axios'); // 下载始终使用 axios
        this.formatter = new DownloadFormatter();
    }

    abstract parse(html: string): Promise<ParseResult>;
    abstract match(url: string): boolean;
    abstract fetchHtml(url: string): Promise<string>;

    // 添加下载相关方法
    async downloadMedia(item: MediaItem, destPath: string): Promise<Buffer> {
        try {
            this.info(`开始下载: ${item.name}`);
            let lastLogged = 0;
            const startTime = Date.now();

            const buffer = await this.downloadRequest.fetchBuffer(
                item.url,
                undefined,
                (downloaded, total) => {
                    // 每秒最多更新一次进度，避免日志刷新太快
                    const now = Date.now();
                    if (now - lastLogged >= 1000) {
                        const speed = (downloaded / (1024 * 1024)) / ((now - startTime) / 1000);
                        this.info(
                            `${item.name} - ` +
                            this.formatter.formatProgress(downloaded, total, speed)
                        );
                        lastLogged = now;
                    }
                }
            );

            await mkdir(dirname(destPath), { recursive: true });
            await Bun.write(destPath, buffer);
            this.success(`下载完成: ${destPath}`);
            return buffer;
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
        let totalBytes = 0;
        const startTime = Date.now();
        
        const downloadItem = async (item: MediaItem) => {
            const ext = extname(item.url) || this.getDefaultExtension(type);
            const filename = `${item.name}${ext}`;
            const destPath = join(outputDir, type, filename);

            try {
                await this.downloadMedia(item, destPath);
                completed++;
                
                // 获取实际文件大小
                try {
                    const stats = await stat(destPath);
                    totalBytes += stats.size;
                } catch (e) {
                    // 如果无法获取文件大小，忽略错误
                }

                const elapsedSeconds = (Date.now() - startTime) / 1000;
                const speedMBps = (totalBytes / (1024 * 1024)) / elapsedSeconds;
                
                this.info(this.formatter.formatBatchProgress(
                    completed,
                    items.length,
                    totalBytes,
                    speedMBps
                ));

                return destPath;
            } catch (error) {
                this.error(`下载失败: ${item.name}`, error);
                throw error;
            }
        };

        try {
            await runConcurrent(items, downloadItem, concurrent);
            this.success(this.formatter.formatSummary(totalBytes, type));
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
        logger.log(this.name, message);
    }

    protected warn(message: string) {
        logger.warn(this.name, message);
    }

    protected error(message: string, error?: any) {
        logger.error(this.name, message, error);
    }

    protected info(message: string) {
        logger.info(this.name, message);
    }

    protected success(message: string) {
        logger.success(this.name, message);
    }

    async close(): Promise<void> {
        await Promise.all([
            this.request.close(),
            this.downloadRequest.close()
        ]);
    }
}