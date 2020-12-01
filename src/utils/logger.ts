import winston from "winston";

const {timestamp, combine, printf} = winston.format;

const myFormat = printf(({timestamp, message}): string => {
  return `${timestamp} ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  transports: [new winston.transports.File({filename: 'logs/info.log', level: 'info'})]
});
