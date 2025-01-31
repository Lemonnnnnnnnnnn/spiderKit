import { describe, expect, test } from "bun:test";
import { runConcurrent } from "./concurrent";

describe("runConcurrent", () => {
  test("应该正确分块并执行任务", async () => {
    const items = [1, 2, 3, 4, 5];
    const results = await runConcurrent(items, async (n) => n * 2, 2);
    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  test("应该处理空数组", async () => {
    const results = await runConcurrent([], async () => 1, 2);
    expect(results).toEqual([]);
  });

  test("应该正确处理并发数大于数组长度的情况", async () => {
    const items = [1, 2];
    const results = await runConcurrent(items, async (n) => n * 2, 5);
    expect(results).toEqual([2, 4]);
  });
}); 