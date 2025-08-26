import winston from 'winston';

const { combine, colorize, printf } = winston.format;

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
    };
  }
  return info;
});

const devFormat = printf((info) => {
  const timestamp = new Date().toISOString();

  const print = [
    timestamp,
    `[${info.level}]`,
    info.service ? `[${info.service}]` : null,
    info.message,
    info.stack ? `\n${info.stack}` : null,
  ];

  return print.filter(Boolean).join(' ');
});

const logger = winston.createLogger({
  level: 'debug',
  format: combine(enumerateErrorFormat(), colorize(), devFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
