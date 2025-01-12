export async function runConcurrent<T, R>(
    items: T[],
    fn: (item: T) => Promise<R>,
    concurrent: number
  ): Promise<R[]> {
    const results: R[] = [];
    const chunks: T[][] = [];
    
    // 将任务分组
    for (let i = 0; i < items.length; i += concurrent) {
      chunks.push(items.slice(i, i + concurrent));
    }
    
    // 按组执行任务
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map(item => fn(item)));
      results.push(...chunkResults);
    }
    
    return results;
  }