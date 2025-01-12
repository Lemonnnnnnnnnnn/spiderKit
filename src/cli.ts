import { Command } from 'commander';
import { Crawler } from './crawler';

const program = new Command();

program
  .name('crawler')
  .description('A flexible web crawler framework')
  .version('1.0.0');

program
  .command('crawl')
  .description('Crawl a website')
  .requiredOption('-u, --url <urls...>', 'Target URLs to crawl')
  .option('-p, --parser <parser>', 'Parser to use', 'default')
  .option('-o, --output <dir>', 'Output directory', './output')
//   .option('-cr, --concurrent-requests <number>', 'Concurrent requests', '3')
  .option('-c, --concurrent-downloads <number>', 'Concurrent downloads', '3')
  .action(async (options) => {
    try {
      const crawler = new Crawler();
      await crawler.crawl({
        ...options,
        // concurrentRequests: parseInt(options.concurrentRequests),
        concurrentDownloads: parseInt(options.concurrentDownloads)
      });
      console.log('Crawling completed successfully!');
    } catch (error) {
      console.error('Crawling failed:', error);
      process.exit(1);
    }
  });

program.parse();