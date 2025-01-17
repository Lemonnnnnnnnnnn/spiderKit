import { describe, expect, test } from "bun:test";
import { Request, type RequestOptions } from "./request";

describe("Request", () => {
  const proxyOptions: RequestOptions = {
    proxy: {
      host: '127.0.0.1',
      port: 7890,
      protocol: 'http'
    },
    timeout: 10000
  };

  test("should fetch text from Google with proxy", async () => {
    const request = new Request(proxyOptions);
    const response = await request.fetchText("https://www.google.com");
    
    expect(response).toContain("<html");
  });

  test("should fetch buffer from Google logo with proxy", async () => {
    const request = new Request(proxyOptions);
    const buffer = await request.fetchBuffer("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
    
    // 验证返回的是否为 Buffer 类型
    expect(buffer).toBeInstanceOf(Buffer);
    // Google logo 的大小应该大于 0
    expect(buffer.length).toBeGreaterThan(0);
  });

  test("should throw error when proxy is not available", async () => {
    const badProxyOptions: RequestOptions = {
      proxy: {
        host: '127.0.0.1',
        port: 1234, // 使用一个不存在的端口
        protocol: 'http'
      },
      timeout: 5000
    };

    const request = new Request(badProxyOptions);
    
    await expect(
      request.fetchText("https://www.google.com")
    ).rejects.toThrow();
  });

  test("should throw error when URL is invalid", async () => {
    const request = new Request(proxyOptions);
    
    await expect(
      request.fetchText("https://invalid-url-that-does-not-exist.com")
    ).rejects.toThrow();
  });
}); 