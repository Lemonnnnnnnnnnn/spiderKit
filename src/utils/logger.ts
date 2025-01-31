export class Logger {
    private static instance: Logger;
    
    private constructor() {}
    
    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    log(name: string, message: string) {
        console.log(`[${name}] ${message}`);
    }

    warn(name: string, message: string) {
        console.warn(`[${name}] ⚠️ ${message}`);
    }

    error(name: string, message: string, error?: any) {
        if (error) {
            console.error(`[${name}] ❌ ${message}:`, error);
        } else {
            console.error(`[${name}] ❌ ${message}`);
        }
    }

    info(name: string, message: string) {
        console.info(`[${name}] ℹ️ ${message}`);
    }

    success(name: string, message: string) {
        console.log(`[${name}] ✅ ${message}`);
    }
}

export const logger = Logger.getInstance(); 