const lab = require("lab").script();
exports.lab = lab;

let Logger = require("../src/index");

lab.experiment("Basic Test", () => {

    lab.test("Default options should log to console", (done) => {

        let logCount = 0;

        console.originalLog = console.log;
        console.log = (data) => {
            console.originalLog(data);
            logCount++;
        };
        console.info = (data) => {
            console.originalLog(data);
            logCount++;
        };
        console.warn = (data) => {
            console.originalLog(data);
            logCount++;
        };
        console.error = (data) => {
            console.originalLog(data);
            logCount++;
        };

        let logger = new Logger();

        logger.log(1);
        logger.info(2);
        logger.warn(3);
        logger.error(4);

        logger.flush();

        lab.expect(logCount).to.equal(4);
        done();

        console.log = console.originalLog;

    });

    lab.test("keep_history should keep all logs in all buffer", (done) => {

        console.originalLog = console.log;
        console.log = (data) => {
            console.originalLog(data);
        };
        console.info = (data) => {
            console.originalLog(data);
        };
        console.warn = (data) => {
            console.originalLog(data);
        };
        console.error = (data) => {
            console.originalLog(data);
        };

        let logger = new Logger({keep_history: true});

        logger.log(1);
        logger.info(2);
        logger.warn(3);
        logger.error(4);

        logger.flush();

        lab.expect(logger.all.length).to.equal(4);
        done();

        console.log = console.originalLog;

    });

    lab.test("Default log level should log everything", (done) => {

        let logCount = 0;
        const mockLogger = {
            log: (data) => {
                console.log(data);
                logCount++;
            },
            info: (data) => {
                console.info(data);
                logCount++;
            },
            warn: (data) => {
                console.warn(data);
                logCount++;
            },
            error: (data) => {
                console.error(data);
                logCount++;
            },
        };

        let logger = new Logger({logger: mockLogger});


        let max =10;
        for(let ipos=0; ipos < max ;ipos++){
            logger.log(ipos);
            logger.info(ipos);
            logger.warn(ipos);
            logger.error(ipos);
        }

        logger.flush();

        lab.expect(logCount).to.equal(max * 4);
        done();

    });

    lab.test("Buffer level INFO should ignore DEBUG log", (done) => {

        let logCount = 0;
        const mockLogger = {
            log: (data) => {
                console.log(data);
                logCount++;
            },
            info: (data) => {
                console.info(data);
                logCount++;
            },
            warn: (data) => {
                console.warn(data);
                logCount++;
            },
            error: (data) => {
                console.error(data);
                logCount++;
            },
        };

        let logger = new Logger({logger: mockLogger, buffer_level: Logger.level.INFO});


        let max =10;
        for(let ipos=0; ipos < max ;ipos++){
            logger.log(ipos);
            logger.info(ipos);
            logger.warn(ipos);
            logger.error(ipos);
        }

        logger.flush();

        lab.expect(logCount).to.equal(max * 3);
        done();

    });

    lab.test("Flush level ERROR should ignore DEBUG,INFO and WARN log before running flush\n", (done) => {

        let logCount = 0;
        const mockLogger = {
            log: (data) => {
                console.log(data);
                logCount++;
            },
            info: (data) => {
                console.info(data);
                logCount++;
            },
            warn: (data) => {
                console.warn(data);
                logCount++;
            },
            error: (data) => {
                console.error(data);
                logCount++;
            },
        };

        let logger = new Logger({logger: mockLogger, buffer_level: Logger.level.INFO, flush_level: Logger.level.ERROR, buffer_size: 100});


        let max = 10;
        for(let ipos=0; ipos < max ;ipos++){
            logger.log(ipos);
            logger.info(ipos);
            logger.warn(ipos);
        }

        lab.expect(logCount).to.equal(0);

        logger.flush();

        done();

    });

    lab.test("Flush level ERROR should ignore DEBUG,INFO and WARN log before running flush\n", (done) => {

        let logCount = 0;
        const mockLogger = {
            log: (data) => {
                console.log(data);
                logCount++;
            },
            info: (data) => {
                console.info(data);
                logCount++;
            },
            warn: (data) => {
                console.warn(data);
                logCount++;
            },
            error: (data) => {
                console.error(data);
                logCount++;
            },
        };

        let logger = new Logger({logger: mockLogger, buffer_level: Logger.level.INFO, flush_level: Logger.level.ERROR, buffer_size: 5});


        let max = 10;
        for(let ipos=0; ipos < max ;ipos++){
            logger.log(ipos);
            logger.info(ipos);
            logger.warn(ipos);
        }
        logger.error("0");

        lab.expect(logCount).to.be.at.most(10);

        logger.flush();

        done();

    });

    lab.test("Skip buffer should log directly to logger", (done) => {

        let logCount = 0;
        const mockLogger = {
            log: (data) => {
                console.log(data);
                logCount++;
            },
            info: (data) => {
                console.info(data);
                logCount++;
            },
            warn: (data) => {
                console.warn(data);
                logCount++;
            },
            error: (data) => {
                console.error(data);
                logCount++;
            },
        };

        let logger = new Logger({logger: mockLogger});

        logger.log(1, true);
        logger.info(2, true);
        logger.warn(3, true);
        logger.error(4, true);

        lab.expect(logCount).to.equal(4);
        done();

    });
});