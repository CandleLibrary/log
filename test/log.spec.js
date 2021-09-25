import { Logger } from "../build/library/logger.js";
import { assert } from "console";

const test_logger = Logger.createLogger("test");
test_logger.activate(test_logger.LogLevel.ALL);
const test_writer = {
    level: -1,
    logger_name: "",
    args: null,
    writeLog(log_name, level, ...args) {
        test_writer.args = args;
        test_writer.level = level;
        test_writer.logger_name = log_name;

    }
};

test_logger.clearWriters();
test_logger.addWriter(test_writer);
test_logger.log("hello world");

assert(test_writer.logger_name == "test");

assert(test_writer.args == ["hello world"]);

test_logger.createLogger("sub-test").warn("warning");

assert(test_writer.logger_name == "test-sub-test");

assert(test_writer.args == ["warning"]);
