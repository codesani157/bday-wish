import { FastifyPluginAsync } from 'fastify';
import { db } from '../db';
import { worlds } from '../db/schema';

export const worldRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', async (request, reply) => {
    const allWorlds = await db.select().from(worlds);
    return allWorlds;
  });
};
