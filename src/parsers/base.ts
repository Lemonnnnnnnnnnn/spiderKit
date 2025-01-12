import type { Parser, ParseResult } from "../types";

export abstract class BaseParser implements Parser {
    abstract name: string;
    abstract parse(html: string): Promise<ParseResult>;
    abstract match(url: string): boolean;
  }