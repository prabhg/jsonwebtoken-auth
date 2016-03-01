'use strict';

var winston = require('winston');
var config = require('./config.json');

var level = process.env.DEBUG_LEVEL || config.debuglevel || 'debug';

winston.setLevels({
    debug:3,
    info: 2,
    warn: 1,
    error:0
});
winston.addColors({
    debug: 'green',
    info:  'cyan',
    warn:  'yellow',
    error: 'red'
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: level,
    colorize:true,
    prettyPrint: true,
    silent: false,
    timestamp: false
});

winston.level = level;

winston.info('initlaized logger...');

/*var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: level,
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: false
        })
    ],
    colors: {
        trace: 'magenta',
        debug: 'blue',
        info: 'cyan',
        warn: 'yellow',
        error: 'red'
    }
});*/

module.exports = winston;
