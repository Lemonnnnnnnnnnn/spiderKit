import type { Parser, ParseResult } from "../types";

export abstract class BaseParser implements Parser {
    abstract name: string;
    abstract parse(html: string): Promise<ParseResult>;
    abstract match(url: string): boolean;

    protected log(message: string) {
        console.log(`[${this.name}] ${message}`);
    }

    protected warn(message: string) {
        console.warn(`[${this.name}] ⚠️ ${message}`);
    }

    protected error(message: string, error?: any) {
        if (error) {
            console.error(`[${this.name}] ❌ ${message}:`, error);
        } else {
            console.error(`[${this.name}] ❌ ${message}`);
        }
    }

    protected info(message: string) {
        console.info(`[${this.name}] ℹ️ ${message}`);
    }

    protected success(message: string) {
        console.log(`[${this.name}] ✅ ${message}`);
    }
}