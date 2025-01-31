export class DownloadFormatter {
    private startTime: number;
    private totalBytes: number = 0;
    
    constructor() {
        this.startTime = Date.now();
    }

    formatProgress(downloaded: number, total: number, speed: number): string {
        const progress = (downloaded / total * 100).toFixed(1);
        return (
            `${progress}% | ` +
            `${this.formatSize(downloaded)}/${this.formatSize(total)} | ` +
            `${speed.toFixed(2)} MB/s`
        );
    }

    formatSummary(totalBytes: number, type: string = ''): string {
        const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const avgSpeed = ((totalBytes / (1024 * 1024)) / parseFloat(totalTime)).toFixed(2);
        
        return (
            `\n${type ? `${type} ` : ''}下载完成！\n` +
            `总大小: ${this.formatSize(totalBytes)} | ` +
            `耗时: ${totalTime}s | ` +
            `平均速度: ${avgSpeed} MB/s`
        );
    }

    private formatSize(bytes: number): string {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    reset(): void {
        this.startTime = Date.now();
        this.totalBytes = 0;
    }

    formatBatchProgress(
        completed: number, 
        total: number,
        totalBytes: number,
        speedMBps: number
    ): string {
        const percentage = ((completed / total) * 100).toFixed(1);
        const progressWidth = 30;
        const filledWidth = Math.floor((completed / total) * progressWidth);
        const progressBar = '█'.repeat(filledWidth) + '░'.repeat(progressWidth - filledWidth);

        return (
            `[${progressBar}] ${percentage}% | ` +
            `${completed}/${total} | ` +
            `速度: ${speedMBps.toFixed(2)} MB/s | ` +
            `已下载: ${this.formatSize(totalBytes)}`
        );
    }
} 