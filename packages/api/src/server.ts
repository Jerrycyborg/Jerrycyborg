import { createServer } from 'http';
import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';

const app = createApp();
const server = createServer(app);

server.listen(config.port, () => {
  logger.info(`PariConnect API listening on http://localhost:${config.port}`);
});
