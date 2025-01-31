import { describe, expect, test } from "bun:test";
import { BaseParser } from "./base";
import type { RequestOptions } from "../request";

class TestParser extends BaseParser {
  name = "test";
  fetcherType = "raw-http" as const;
  
  parse(html: string): Promise<any> { return Promise.resolve({}); }
  match(url: string): boolean { return true; }
  fetchHtml(url: string): Promise<string> { return Promise.resolve(""); }
}

describe("BaseParser", () => {
  const parser = new TestParser();

  test("应该正确生成默认扩展名", () => {
    expect(parser.getDefaultExtension("videos")).toBe(".mp4");
    expect(parser.getDefaultExtension("images")).toBe(".jpg");
    expect(parser.getDefaultExtension("unknown")).toBe("");
  });
}); 