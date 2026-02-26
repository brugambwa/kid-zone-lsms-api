import { createLogger, format, transports } from "winston";
import type { TransformableInfo } from "logform";
import { LOG_LEVEL, APP_ENV } from "../config/constants";

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf((info: TransformableInfo) => {
  return `${info.timestamp} [${info.level}]: ${info.stack || info.message}`;
});
const isTest = APP_ENV === "test";
export const logger = createLogger({
  level: LOG_LEVEL || "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: isTest
    ? [new transports.Console({ silent: true })]
    : [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
      ],
  exitOnError: false,
});
