const debug = require('debug')('yeps:logger');
const winston = require('winston');
const config = require('config');
const transports = [];

debug(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'production') {

    debug('File');

    transports.push(
        new winston.transports.File(
            Object.assign({ level: 'error' }, config.logger)
        )
    );

} else {

    debug('Console');

    transports.push(new (winston.transports.Console)({
        level: 'info',
        json: false,
        timestamp: true,
        colorize: true,
        prettyPrint: true,
        showLevel: true
    }));

}

const logger = new (winston.Logger)({
    transports,
    exceptionHandlers: transports,
    exitOnError: false
});

module.exports = logger;
