import * as fs from 'fs';
import * as path from 'path';
import * as pinoms from 'pino-multi-stream';
import { Logger } from 'pino-multi-stream';

const logDir = path.join('C:\\logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, 'app.log');
const fileStream = fs.createWriteStream(logFilePath);

const prettyStream = pinoms.prettyStream({
  prettyPrint: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname',
  },
});

const streams = [{ stream: fileStream }];

export const logger: Logger = pinoms({ streams: streams });
