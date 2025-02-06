import dotenv from 'dotenv';
import winston from 'winston';
import 'winston-daily-rotate-file';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const { combine, timestamp, printf } = winston.format;

// 로그 포맷 설정
const myFormat = printf(({ timestamp, level, message, ...meta }) => {
  const metaString =
    meta && Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}` // 2칸 들여쓰기
      : '';
  return `${timestamp} ${level}: ${message}${metaString}`;
});

// 공통 파일 로그 설정
const fileTransport = new winston.transports.File({
  filename: 'logs/combined.log',
  level: nodeEnv === 'devleopment' ? 'info' : 'info', // production과 동일
});

// 개발 환경에서만 debug 로그 추가
const debugTransport =
  nodeEnv === 'development'
    ? new winston.transports.DailyRotateFile({
        filename: 'logs/%DATE%-debug.log',
        datePattern: 'YYYY-MM-DD',
        level: 'debug',
        maxFiles: '5d',
        zippedArchive: true,
        format: winston.format.combine(
          winston.format((info) => {
            return info.level === 'debug' ? info : false; // debug만 필터링
          })(),
          myFormat,
        ),
      })
    : null;

export const logger = winston.createLogger({
  level: nodeEnv === 'devleopment' ? 'debug' : 'info', // 기본 레벨
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
  transports: [
    new winston.transports.Console(), // 콘솔 로그는 항상 출력
    fileTransport, // info 이상은 combined.log에 기록
    ...(debugTransport ? [debugTransport] : []), // development에서만 debug.log 기록
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // error는 항상 기록
    }),
  ],
});
