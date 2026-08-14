import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '../db';
import { senders, senderSessions, magicLinkTokens } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const authRoutes: FastifyPluginAsync = async (server) => {
  
  // 1. Request Magic Link
  server.post('/request-magic-link', async (request, reply) => {
    const schema = z.object({ email: z.string().email() });
    const { email } = schema.parse(request.body);

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.insert(magicLinkTokens).values({
      email,
      tokenHash,
      expiresAt,
    });

    // In a real app, send an email here. For sandbox, just log it.
    server.log.info(`[SANDBOX EMAIL] Magic link for ${email}: https://reveal.birthdayreveal.com/auth/verify?token=${token}`);
    
    return { success: true, message: 'Magic link sent if email is valid.' };
  });

  // 2. Verify Magic Link
  server.post('/verify-magic-link', async (request, reply) => {
    const schema = z.object({ token: z.string() });
    const { token } = schema.parse(request.body);

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const [magicToken] = await db.select()
      .from(magicLinkTokens)
      .where(and(eq(magicLinkTokens.tokenHash, tokenHash), gt(magicLinkTokens.expiresAt, new Date())))
      .limit(1);

    if (!magicToken) {
      return reply.code(401).send({ error: 'Invalid or expired magic link' });
    }

    // Find or create sender
    let [sender] = await db.select().from(senders).where(eq(senders.email, magicToken.email)).limit(1);
    if (!sender) {
      const [newSender] = await db.insert(senders).values({ email: magicToken.email }).returning();
      sender = newSender;
    }

    // Delete used token
    await db.delete(magicLinkTokens).where(eq(magicLinkTokens.id, magicToken.id));

    // Create session (Refresh Token)
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const [session] = await db.insert(senderSessions).values({
      senderId: sender.id,
      refreshTokenHash,
      expiresAt: refreshExpiresAt,
    }).returning();

    // Generate JWT Access Token
    const accessToken = server.jwt.sign({ sub: sender.id, email: sender.email }, { expiresIn: '15m' });

    return {
      accessToken,
      refreshToken,
      session: { id: sender.id, senderId: sender.id, email: sender.email, displayName: null }
    };
  });

  // 3. Get Session
  server.get('/session', { preValidation: [server.authenticate] }, async (request, reply) => {
    const user = request.user as { sub: string, email: string };
    const [sender] = await db.select().from(senders).where(eq(senders.id, user.sub)).limit(1);
    if (!sender) return reply.code(401).send({ error: 'Sender not found' });
    return { id: sender.id, senderId: sender.id, email: sender.email, displayName: null };
  });

  // 4. Logout
  server.post('/logout', { preValidation: [server.authenticate] }, async (request, reply) => {
    const user = request.user as { sub: string };
    await db.delete(senderSessions).where(eq(senderSessions.senderId, user.sub));
    return { success: true };
  });

  // 5. Refresh Token
  server.post('/refresh', async (request, reply) => {
    const schema = z.object({ refreshToken: z.string() });
    const { refreshToken } = schema.parse(request.body);
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const [session] = await db.select()
      .from(senderSessions)
      .where(and(eq(senderSessions.refreshTokenHash, refreshTokenHash), gt(senderSessions.expiresAt, new Date())))
      .limit(1);

    if (!session) return reply.code(401).send({ error: 'Invalid or expired refresh token' });

    const [sender] = await db.select().from(senders).where(eq(senders.id, session.senderId)).limit(1);
    
    // Rotate refresh token
    await db.delete(senderSessions).where(eq(senderSessions.id, session.id));
    
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await db.insert(senderSessions).values({
      senderId: sender.id,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const accessToken = server.jwt.sign({ sub: sender.id, email: sender.email }, { expiresIn: '15m' });
    return { accessToken, refreshToken: newRefreshToken };
  });
};
