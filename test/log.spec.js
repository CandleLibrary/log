import { Logger } from "../build/library/logger.js";
import { assert } from "console";

assert_group(sequence, () => {

    const test_logger = Logger.createLogger("test");
    test_logger.activate(test_logger.LogLevel.ALL);
    const test_writer = {
        level: -1,
        logger_name: "",
        args: null,
        REWRITE: false,
        writeLog(log_name, level, REWRITE, ...args) {
            test_writer.args = args;
            test_writer.level = level;
            test_writer.REWRITE = REWRITE;
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
    assert(test_writer.REWRITE == false);

    test_logger.createLogger("sub-test").rewrite_log("warning");

    assert("rewrite_name", test_writer.logger_name == "test-sub-test");
    assert("rewrite_flag", test_writer.REWRITE == true);

});