import { createWriteStream, type Stats } from 'fs';
import { mkdir, stat, unlink } from 'fs/promises';
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
        this.downloadRequest = new Request(options);
        this.formatter = new DownloadFormatter();
    }

    abstract parse(html: string): Promise<ParseResult>;
    abstract match(url: string): boolean;
    abstract fetchHtml(url: string): Promise<string>;

    // 添加下载相关方法
    async downloadMedia(item: MediaItem, destPath: string): Promise<Buffer> {
        // 使用 downloadWithResume 作为默认实现
        return this.downloadWithResume(item, destPath);
    }

    protected async downloadWithResume(
        item: MediaItem,
        destPath: string,
        headers: Record<string, string> = {}
    ): Promise<Buffer> {
        let writeStream: ReturnType<typeof createWriteStream> | null = null;
        let lastLogged = 0;
        const startTime = Date.now();
        let fileStats: Stats | null = null;

        try {
            // 检查是否存在已下载的文件
            try {
                fileStats = await stat(destPath);
                const remoteHeaders = await this.downloadRequest.fetchHeaders(item.url, headers);
                const remoteSize = parseInt(remoteHeaders['content-length'] || '0', 10);

                if (fileStats.size === remoteSize && remoteSize > 0) {
                    this.success(`文件已存在且完整: ${destPath}`);
                    return Buffer.from([]);
                }

                if (fileStats.size > remoteSize && remoteSize > 0) {
                    this.warn(`本地文件大小异常，将重新下载`);
                    await unlink(destPath);
                    fileStats = null;
                } else if (fileStats.size < remoteSize) {
                    this.info(`发现未完成的下载，从 ${this.formatter.formatSize(fileStats.size)} 处继续`);
                    headers['Range'] = `bytes=${fileStats.size}-`;
                }
            } catch (e) {
                // 文件不存在，从头开始下载
                fileStats = null;
            }

            // 创建目录
            await mkdir(dirname(destPath), { recursive: true });
            
            // 根据是否需要断点续传选择写入模式
            const writeMode = headers['Range'] ? 'a' : 'w';
            writeStream = createWriteStream(destPath, { flags: writeMode });

            await this.downloadRequest.fetchBuffer(
                item.url,
                headers,
                (downloaded, total) => {
                    const now = Date.now();
                    if (now - lastLogged >= 1000) {
                        const dl = downloaded + (fileStats?.size || 0);
                        const speed = (downloaded / (1024 * 1024)) / ((now - startTime) / 1000);
                        this.info(
                            `${item.name} - ` +
                            this.formatter.formatProgress(dl, total, speed)
                        );
                        lastLogged = now;
                    }
                },
                async (chunk) => {
                    if (!writeStream) {
                        throw new Error('Write stream is not initialized');
                    }
                    return new Promise((resolve, reject) => {
                        writeStream!.write(chunk, (error) => {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
                },
                fileStats?.size || 0
            );

            // 关闭写入流
            await new Promise((resolve, reject) => {
                if (!writeStream) {
                    reject(new Error('Write stream is not initialized'));
                    return;
                }
                writeStream.end((error: any) => {
                    if (error) reject(error);
                    else resolve(null);
                });
            });

            this.success(`下载完成: ${destPath}`);
            return Buffer.from([]);

        } catch (error) {
            this.error(`下载失败: ${item.name}`, error);
            throw error;
        } finally {
            if (writeStream) {
                writeStream.end();
            }
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

    public getDefaultExtension(type: string): string {
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