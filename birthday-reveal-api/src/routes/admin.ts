import { FastifyPluginAsync } from 'fastify';
import { db } from '../db';
import { deliveryJobs } from '../db/schema';
import { sql } from 'drizzle-orm';

export const adminRoutes: FastifyPluginAsync = async (server) => {
  server.get('/health', async (request, reply) => {
    // In production, this would be secured behind admin auth
    try {
      const backlogQuery = await db
        .select({ count: sql<number>`cast(count(${deliveryJobs.id}) as integer)` })
        .from(deliveryJobs)
        .where(sql`${deliveryJobs.status} = 'pending' AND ${deliveryJobs.executeAtUtc} <= now()`);
        
      const failedQuery = await db
        .select({ count: sql<number>`cast(count(${deliveryJobs.id}) as integer)` })
        .from(deliveryJobs)
        .where(sql`${deliveryJobs.status} = 'failed'`);

      return {
        status: 'ok',
        metrics: {
          jobBacklogDepth: backlogQuery[0]?.count || 0,
          failedDeliveryCount: failedQuery[0]?.count || 0,
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve admin health metrics' });
    }
  });
};
