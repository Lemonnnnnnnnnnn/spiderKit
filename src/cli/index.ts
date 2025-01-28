#!/usr/bin/env bun
import { Command } from 'commander';
import { Crawler } from '../core/crawler';
import type { RequestOptions } from '../core/request';

const program = new Command();

program
  .name('media-crawler')
  .description('A CLI tool to crawl media files from websites')
  .version('1.0.0')
  .requiredOption('-u, --url <urls...>', 'URLs to crawl')
  .requiredOption('-o, --output <path>', 'Output directory path')
  .option('-c, --concurrent <number>', 'Number of concurrent downloads', '1')
  .option('--proxy-host <host>', 'Proxy host')
  .option('--proxy-port <port>', 'Proxy port')
  .option('--proxy-protocol <protocol>', 'Proxy protocol (http/https)', 'http')
  .option('--timeout <ms>', 'Request timeout in milliseconds', '30000')
  .parse();

const options = program.opts();

const requestOptions: RequestOptions = {
  timeout: parseInt(options.timeout)
};

// 如果提供了代理配置，添加到请求选项中
if (options.proxyHost && options.proxyPort) {
  requestOptions.proxy = {
    host: options.proxyHost,
    port: parseInt(options.proxyPort),
    protocol: options.proxyProtocol
  };
}

const crawler = new Crawler({
  ...requestOptions,
});

// 添加错误处理和进程退出逻辑
async function main() {
  try {
    await crawler.crawl({
      url: options.url,
      output: options.output,
      concurrentDownloads: parseInt(options.concurrent),
    });
    process.exit(0);
  } catch (error) {
    console.error('Crawling failed:', error);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', async (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

main();