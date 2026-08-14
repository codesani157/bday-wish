import { FastifyPluginAsync } from 'fastify';
import { db } from '../db';
import { celebrations, worlds, revealEvents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const revealRoutes: FastifyPluginAsync = async (server) => {
  // Public reveal payload
  server.get('/:token', async (request, reply) => {
    const { token } = request.params as { token: string };

    const [celebration] = await db.select().from(celebrations)
      .where(eq(celebrations.id, token))
      .limit(1);

    if (!celebration) {
      return reply.code(404).send({ error: 'Reveal not found or expired' });
    }

    if (celebration.status === 'cancelled' || celebration.status === 'draft') {
      return reply.code(400).send({ error: 'This gift is not ready yet.' });
    }

    const [world] = await db.select().from(worlds)
      .where(eq(worlds.id, celebration.worldId))
      .limit(1);

    const now = new Date();
    
    // Countdown state (pre-birthday)
    if (celebration.scheduledSendAtUtc && now < celebration.scheduledSendAtUtc) {
      return {
        mode: 'countdown',
        unlocksAt: celebration.scheduledSendAtUtc,
        worldConfig: world,
        recipientName: celebration.recipientName
      };
    }

    // Full reveal state
    return {
      mode: 'reveal',
      celebration: {
        id: celebration.id,
        recipientName: celebration.recipientName,
        headline: celebration.headline,
        messageBody: celebration.messageBody,
        musicUrl: celebration.musicUrl,
        memoryPromptQuestion: celebration.memoryPromptQuestion,
      },
      worldConfig: world
    };
  });

  // Track telemetry events
  server.post('/:token/events', async (request, reply) => {
    const { token } = request.params as { token: string };
    
    const [celebration] = await db.select().from(celebrations)
      .where(eq(celebrations.id, token))
      .limit(1);

    if (!celebration) {
      return reply.code(404).send({ error: 'Reveal not found' });
    }

    const schema = z.object({
      eventType: z.enum(['link_opened', 'tier_detected', 'assets_loaded', 'swoop_completed', 'gift_tapped', 'unwrap_started', 'unwrap_completed', 'prompt_passed', 'prompt_failed', 'prompt_bypassed', 'message_viewed', 'photos_viewed', 'music_started', 'easter_egg_found', 'celebration_reached', 'replay_triggered']),
      eventData: z.any().optional()
    });
    
    const { eventType, eventData } = schema.parse(request.body);

    await db.insert(revealEvents).values({
      celebrationId: celebration.id,
      eventType,
      eventData: {
        ...eventData,
        userAgent: request.headers['user-agent']
      },
    });

    // Handle 'link_opened' state transition and Sender Notification
    if (eventType === 'link_opened' && celebration.firstOpenedAt === null) {
      await db.update(celebrations)
        .set({ firstOpenedAt: new Date(), status: 'opened' })
        .where(eq(celebrations.id, celebration.id));
        
      console.log(`[EMAIL NOTIFICATION] Sending 'Recipient Opened Gift' email to Sender ID: ${celebration.senderId}`);
    }
    
    // Handle 'celebration_reached' state transition
    if (eventType === 'celebration_reached' && celebration.completedAt === null) {
      await db.update(celebrations)
        .set({ completedAt: new Date(), status: 'completed' })
        .where(eq(celebrations.id, celebration.id));
    }

    return { success: true };
  });
};
