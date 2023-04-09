const winston = require("winston");

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [
  new winston.transports.Console(),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: './logs/error.log',
    level: 'debug',
    handleExceptions: true, 
    handleRejections: true, 
  }),
  ],
});

module.exports = logger;