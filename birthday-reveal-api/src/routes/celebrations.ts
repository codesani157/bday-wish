import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { eq, desc, and } from 'drizzle-orm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { calculateNextSendAtUtc } from '../services/schedulingService';
import { deliveryJobs, celebrations, worlds } from '../db/schema';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL || 'https://sandbox.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'sandbox-access-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'sandbox-secret-key',
  }
});

export const celebrationRoutes: FastifyPluginAsync = async (server) => {
  
  // List user celebrations
  server.get('/', { preValidation: [server.authenticate] }, async (request, reply) => {
    const user = request.user as { sub: string };
    
    const userCelebrations = await db.select({
      id: celebrations.id,
      recipientName: celebrations.recipientName,
      worldKey: worlds.worldKey,
      worldDisplayName: worlds.displayName,
      status: celebrations.status,
      scheduledSendAtUtc: celebrations.scheduledSendAtUtc,
      sentAt: celebrations.sentAt,
      firstOpenedAt: celebrations.firstOpenedAt,
      completedAt: celebrations.completedAt,
    })
    .from(celebrations)
    .innerJoin(worlds, eq(celebrations.worldId, worlds.id))
    .where(eq(celebrations.senderId, user.sub))
    .orderBy(desc(celebrations.createdAt));
    
    return userCelebrations.map(c => ({
      ...c,
      mediaCount: 0,
      hiddenSurpriseCount: 0
    }));
  });

  // Get specific celebration
  server.get('/:id', { preValidation: [server.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as { sub: string };
    
    const [celebration] = await db.select()
      .from(celebrations)
      .where(and(eq(celebrations.id, id), eq(celebrations.senderId, user.sub)))
      .limit(1);
      
    if (!celebration) return reply.code(404).send({ error: 'Not found' });
    
    const [world] = await db.select().from(worlds).where(eq(worlds.id, celebration.worldId)).limit(1);
    
    return { ...celebration, worldKey: world?.worldKey || 'unknown', media: [], hiddenSurprises: [] };
  });

  // Create Celebration (Step 1 -> 2)
  server.post('/', { preValidation: [server.authenticate] }, async (request, reply) => {
    const schema = z.object({
      recipientName: z.string(),
      recipientEmail: z.string().email(),
      recipientBirthdate: z.string(),
      recipientTimezone: z.string(),
      worldId: z.string().uuid(),
    });
    
    const data = schema.parse(request.body);
    const user = request.user as { sub: string };
    
    const [celebration] = await db.insert(celebrations).values({
      ...data,
      senderId: user.sub,
      status: 'draft',
    }).returning();
    
    return celebration;
  });

  // Seal Celebration
  server.post('/:id/seal', { preValidation: [server.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as { sub: string };

    const schema = z.object({ defaultSendLocalTime: z.string().default('09:00') });
    const { defaultSendLocalTime } = schema.parse(request.body);
    
    const [celebration] = await db.select().from(celebrations)
      .where(and(eq(celebrations.id, id), eq(celebrations.senderId, user.sub)))
      .limit(1);

    if (!celebration) return reply.code(404).send({ error: 'Not found' });
    if (celebration.status !== 'draft') return reply.code(400).send({ error: 'Can only seal draft' });

    const scheduledSendAtUtc = calculateNextSendAtUtc(
      celebration.recipientBirthdate,
      celebration.recipientTimezone,
      defaultSendLocalTime
    );

    const [sealed] = await db.update(celebrations)
      .set({ 
        status: 'sealed', 
        scheduledSendAtUtc,
        updatedAt: new Date()
      })
      .where(eq(celebrations.id, celebration.id))
      .returning();

    await db.insert(deliveryJobs).values({
      celebrationId: celebration.id,
      executeAtUtc: scheduledSendAtUtc,
      status: 'pending',
    });

    return sealed;
  });

  // Update Celebration (Auto-save)
  server.patch('/:id', { preValidation: [server.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as { sub: string };
    
    const schema = z.object({
      headline: z.string().optional(),
      messageBody: z.string().optional(),
      musicUrl: z.string().optional(),
      memoryPromptQuestion: z.string().optional(),
      memoryPromptAnswerHash: z.string().optional(),
    });
    
    const data = schema.parse(request.body);
    
    const [updated] = await db.update(celebrations)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(celebrations.id, id), eq(celebrations.senderId, user.sub)))
      .returning();
      
    if (!updated) return reply.code(404).send({ error: 'Not found' });
    
    return updated;
  });

  // Generate Presigned Upload URL for Media
  server.post('/:id/media/upload-url', { preValidation: [server.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as { sub: string };
    
    // Verify ownership
    const [celebration] = await db.select().from(celebrations)
      .where(and(eq(celebrations.id, id), eq(celebrations.senderId, user.sub)))
      .limit(1);
    if (!celebration) return reply.code(404).send({ error: 'Celebration not found' });

    const schema = z.object({
      filename: z.string(),
      mimeType: z.string().startsWith('image/'),
    });
    const { filename, mimeType } = schema.parse(request.body);
    
    const ext = filename.split('.').pop();
    const storageKey = `celebrations/${id}/media/${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'birthday-reveal-sandbox',
      Key: storageKey,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return { uploadUrl, storageKey };
  });
};
