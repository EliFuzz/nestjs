import * as winston from 'winston';
import { createLogger } from 'winston';

// Create console transport with proper formatting
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      ({
        timestamp,
        level,
        message,
        context,
        trace,
      }: winston.Logform.TransformableInfo) => {
        const contextStr = context ? `[${JSON.stringify(context)}] ` : '';
        const traceStr = trace ? `\n${JSON.stringify(trace)}` : '';
        return `${timestamp as string} ${level}: ${contextStr}${message as string}${traceStr}`;
      },
    ),
  ),
});

// Create file transports for production
const fileTransports =
  process.env.NODE_ENV === 'production'
    ? [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ]
    : [];

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [consoleTransport, ...fileTransports],
  // Ensure we always have at least one transport
  exitOnError: false,
});

// Configure Winston's default logger to use the same transports
winston.configure({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [consoleTransport, ...fileTransports],
  exitOnError: false,
});

export default logger;
