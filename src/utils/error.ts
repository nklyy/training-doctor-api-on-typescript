import winston from "winston";

const {timestamp, combine, printf} = winston.format;

const myFormat = printf(({timestamp, message}): string => {
  return `${timestamp} ${message}`;
});

export const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(), myFormat),
  transports: [new winston.transports.File({filename: 'logs/error.log', level: 'error'})]
});
