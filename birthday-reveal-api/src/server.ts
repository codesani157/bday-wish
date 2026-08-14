import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import jwtPlugin from './plugins/jwt';
import { authRoutes } from './routes/auth';
import { worldRoutes } from './routes/worlds';
import { celebrationRoutes } from './routes/celebrations';
import { webhookRoutes } from './routes/webhooks';
import { revealRoutes } from './routes/reveals';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
});

async function start() {
  await server.register(cors, {
    origin: '*', // Adjust for production later
  });

  await server.register(jwtPlugin);

  // Global error handler for Zod validation errors
  server.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send({ error: 'Validation failed', details: error.errors });
      return;
    }
    reply.send(error);
  });

  server.get('/health', async () => {
    return { status: 'ok', service: 'birthday-reveal-api', timestamp: new Date().toISOString() };
  });

  server.register(authRoutes, { prefix: '/auth' });
  server.register(worldRoutes, { prefix: '/worlds' });
  server.register(celebrationRoutes, { prefix: '/celebrations' });
  server.register(webhookRoutes, { prefix: '/webhooks' });
  server.register(revealRoutes, { prefix: '/public/reveals' });

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info('Server successfully booted up.');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
