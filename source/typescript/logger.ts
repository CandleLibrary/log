export enum LogLevel {
    CRITICAL = 1 << 0,
    ERROR = 1 << 1,
    WARN = 1 << 2,
    INFO = 1 << 3,
    DEBUG = 1 << 4,
    ALL = 0xFFFFFFFF
}

export class LogWriter {
    writeLog(
        logger_name: string,
        log_level: LogLevel,
        ...args: any[]
    ) {
        switch (log_level) {
            case LogLevel.CRITICAL:
                console.error(logger_name + ">", ...args);
                break;
            case LogLevel.ERROR:
                console.error(logger_name + ">", ...args);
                break;
            case LogLevel.WARN:
                console.warn(logger_name + ">", ...args);
                break;
            case LogLevel.INFO:
                console.info(logger_name + ">", ...args);
                break;
            case LogLevel.DEBUG:
                console.debug(logger_name + ">", ...args);
                break;
        }
    }
}

let __internal_logger__ = null;
let logs = new Map;

function internal_logger() {

    if (!__internal_logger__)
        __internal_logger__ = new Logger("internal-logger");

    return __internal_logger__;
}

export class Logger {

    static get LogLevel() {
        return LogLevel;
    }

    static get(name: string): Logger {
        return Logger.createLogger(name);
    }

    static createLogger(name: string): Logger {
        if (!logs.has(name)) {
            logs.set(name, new Logger(name, new LogWriter));
        }
        return logs.get(name);
    }

    get LogLevel() {
        return LogLevel;
    }

    deactivate(log_level: LogLevel = LogLevel.CRITICAL | LogLevel.ERROR | LogLevel.WARN | LogLevel.DEBUG | LogLevel.INFO) {

        this.ACTIVE &= ~(0xFFFFFFFF & log_level);

        for (const child of this.children)
            child.deactivate(log_level);
    }

    activate(log_level: LogLevel = LogLevel.CRITICAL | LogLevel.ERROR | LogLevel.WARN | LogLevel.DEBUG | LogLevel.INFO) {

        this.ACTIVE |= log_level;

        for (const child of this.children)
            child.activate(log_level);
    }

    log(...args) {
        if (this.ACTIVE & LogLevel.INFO)
            for (const writer of this.log_writers)
                writer.writeLog(this.render_name, LogLevel.INFO, ...args);
    }

    error(...args) {
        if (this.ACTIVE & LogLevel.ERROR)
            for (const writer of this.log_writers)
                writer.writeLog(this.render_name, LogLevel.ERROR, ...args);
    }

    warn(...args) {
        if (this.ACTIVE & LogLevel.WARN)
            for (const writer of this.log_writers)
                writer.writeLog(this.render_name, LogLevel.WARN, ...args);
    }

    debug(...args) {
        if (this.ACTIVE & LogLevel.DEBUG)
            for (const writer of this.log_writers)
                writer.writeLog(this.render_name, LogLevel.DEBUG, ...args);
    }

    clearWriters() {
        this.log_writers.length = 0;
        for (const child of this.children)
            child.clearWriters();
    }

    addWriter(writer: LogWriter) {
        if (typeof writer.writeLog == "function") {
            this.log_writers.push(writer);
            for (const child of this.children)
                child.addWriter(writer);
        } else
            internal_logger().console.warn(`Attempt to add writer to logger [${this.render_name}] failed: The writer does not have a valid [writeLog] method.`);
    }

    get name() {
        return this._name;
    }
    set name(name: string) {

        this._name = name;

        this.update_name();
    }

    createLogger(name: string) {

        const child_logger = Logger.createLogger(this.base_name + "-" + name);

        if (!child_logger.parent) {
            this.children.push(child_logger);
            child_logger.log_writers = this.log_writers.slice();
            child_logger._name = name;
            child_logger.parent = this;
            child_logger.update_name();
            child_logger.ACTIVE = this.ACTIVE;
        }

        return child_logger;
    }

    get(name: string) {
        return this.createLogger(name);
    }

    constructor(name, writer: LogWriter = null) {
        this._name = name;
        this.base_name = name;
        this.render_name = name;
        this.children = [];
        this.log_writers = [];
        this.parent = null;

        if (writer)
            this.addWriter(writer);

        //Logger is deactivated by default
        this.ACTIVE = 0;
    }
    private update_name() {
        this.render_name = (this?.parent?.render_name ? this?.parent?.render_name + "-" : "") + this._name;
        for (const child of this.children)
            child.update_name();
    }


    base_name: string;

    log_writers: LogWriter[];

    render_name: string;

    parent: Logger;

    ACTIVE: LogLevel;

    _name: string;

    children: Logger[];
}
