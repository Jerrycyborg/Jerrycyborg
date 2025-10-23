import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { mockAuth } from './middleware/auth';
import { logger } from './logger';
import { router } from './routes';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ logger }));
  app.use(mockAuth);
  app.use('/api', router);
  app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: number }).status : 500;
    res.status(status ?? 500).json({ message });
  });
  return app;
}
