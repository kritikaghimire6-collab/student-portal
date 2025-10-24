import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logs', 'audit.log');
fs.mkdirSync(path.dirname(logFile), { recursive: true });

export const audit = (req, res, next) => {
  const who = req.user ? `${req.user.id}:${req.user.role}` : 'anon';
  const line = `${new Date().toISOString()} ${who} ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(logFile, line, () => {});
  next();
};
