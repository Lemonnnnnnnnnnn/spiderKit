import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { Request, type RequestOptions } from ".";

describe("Request", () => {
  const proxyOptions: RequestOptions = {
    proxy: {
      host: '127.0.0.1',
      port: 7890,
      protocol: 'http'
    },
    timeout: 30000  // 增加超时时间到30秒
  };

  describe("Playwright Tests", () => {
    let request: Request;

    beforeAll(() => {
      request = new Request(proxyOptions); // 使用 Playwright
    });

    test("should fetch text from baidu using Playwright", async () => {
      const response = await request.fetchText("https://baidu.com");
      expect(response).toContain("<html");
    });

    test("should fetch text from ddys.pro using Playwright", async () => {
      const response = await request.fetchText("https://ddys.pro/severance/");
      
      expect(response).toContain("<html");
      expect(response).toContain("Severance"); // 页面标题应该包含剧名
    } , 120000); // 增加测试超时时间到 120 秒

    test("should handle errors gracefully when using Playwright", async () => {
      await expect(
        request.fetchText("https://invalid-url-that-does-not-exist.com")
      ).rejects.toThrow();
    }, 120000);
  });

  describe("Raw-http Tests", () => {
    let request: Request;

    beforeAll(() => {
      request = new Request(proxyOptions, 'raw-http'); // 使用 Axios
    });

    test("should fetch text from Google with proxy", async () => {
      const response = await request.fetchText("https://www.google.com");
      expect(response).toContain("<html");
    });

    test("should fetch buffer from Google logo with proxy", async () => {
      const buffer = await request.fetchBuffer("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    test("should throw error when proxy is not available", async () => {
      const badProxyOptions: RequestOptions = {
        proxy: {
          host: '127.0.0.1',
          port: 1234,
          protocol: 'http'
        },
        timeout: 30000
      };

      const request = new Request(badProxyOptions);
      await expect(
        request.fetchText("https://www.google.com")
      ).rejects.toThrow();
    });

  });

  describe("Request - Raw HTTP", () => {
    let request: Request;

    beforeAll(() => {
      request = new Request(proxyOptions, 'raw-http');
    });

    test("应该正确处理HEAD请求", async () => {
      const headers = await request.fetchHeaders("https://www.google.com");
      expect(headers).toHaveProperty("content-type");
    });

    test("应该处理无效URL", async () => {
      await expect(request.fetchText("invalid-url")).rejects.toThrow();
    });
  });

  describe("Playwright Tests - Advanced", () => {
    let request: Request;

    beforeAll(() => {
      request = new Request(proxyOptions, 'playwright');
    });

    test("应该正确处理页面内容", async () => {
      const content = await request.fetchText("https://example.com");
      expect(content).toContain("<html");
    });
  });
}); 