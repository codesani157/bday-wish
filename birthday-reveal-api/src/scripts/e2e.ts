import Fastify from 'fastify';
import { db } from '../db';
import { senders, worlds, celebrations, deliveryJobs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { celebrationRoutes } from '../routes/celebrations';
import { authRoutes } from '../routes/auth';
import { revealRoutes } from '../routes/reveals';
import { webhookRoutes } from '../routes/webhooks';
import { worldRoutes } from '../routes/worlds';
import fastifyJwt from '@fastify/jwt';
import crypto from 'crypto';

async function runE2E() {
  console.log('🚀 Starting End-to-End Integration Simulation...');

  // 1. Setup mock server
  const server = Fastify();
  server.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'super-secret-key' });
  
  server.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  server.register(authRoutes, { prefix: '/auth' });
  server.register(worldRoutes, { prefix: '/worlds' });
  server.register(celebrationRoutes, { prefix: '/celebrations' });
  server.register(webhookRoutes, { prefix: '/webhooks' });
  server.register(revealRoutes, { prefix: '/public/reveals' });

  await server.ready();

  // 2. Create mock sender
  console.log('👤 Creating test sender...');
  const testEmail = `test-${Date.now()}@example.com`;
  const [sender] = await db.insert(senders).values({ email: testEmail }).returning();

  // 3. Generate token for sender
  const token = server.jwt.sign({ sub: sender.id, email: sender.email }, { expiresIn: '1h' });
  const headers = { authorization: `Bearer ${token}` };

  // 4. Fetch worlds
  console.log('🌍 Fetching available worlds...');
  const worldsRes = await server.inject({ method: 'GET', url: '/worlds' });
  const worldsList = JSON.parse(worldsRes.payload);
  console.log(`✅ Found ${worldsList.length} worlds. Picking first: ${worldsList[0].worldKey}`);
  const worldId = worldsList[0].id;

  // 5. Create draft celebration
  console.log('📝 Creating celebration draft...');
  const createRes = await server.inject({
    method: 'POST',
    url: '/celebrations',
    headers,
    payload: {
      worldId,
      recipientName: 'E2E Tester',
      recipientEmail: 'recipient@example.com',
      recipientBirthdate: '2027-01-01',
      recipientTimezone: 'UTC'
    }
  });
  if (createRes.statusCode !== 200) throw new Error(createRes.payload);
  const celebration = JSON.parse(createRes.payload);
  console.log(`✅ Draft created with ID: ${celebration.id}`);

  // 6. Update draft (Simulating debounced autosave)
  console.log('💾 Auto-saving celebration content...');
  await server.inject({
    method: 'PATCH',
    url: `/celebrations/${celebration.id}`,
    headers,
    payload: {
      headline: 'Happy E2E Birthday!',
      messageBody: 'This gift was generated automatically.',
    }
  });

  // 7. Seal the gift
  console.log('🔒 Sealing the celebration...');
  const sealRes = await server.inject({
    method: 'POST',
    url: `/celebrations/${celebration.id}/seal`,
    headers,
    payload: { defaultSendLocalTime: '09:00' }
  });
  if (sealRes.statusCode !== 200) throw new Error(sealRes.payload);
  const sealed = JSON.parse(sealRes.payload);
  console.log(`✅ Gift sealed! Scheduled for UTC: ${sealed.scheduledSendAtUtc}`);

  // 8. Wait for Worker / Check Delivery Job
  console.log('⚙️ Checking delivery queue...');
  const [job] = await db.select().from(deliveryJobs).where(eq(deliveryJobs.celebrationId, celebration.id));
  if (!job) throw new Error("No delivery job found!");
  console.log(`✅ Job created with status: ${job.status} to run at: ${job.executeAtUtc}`);

  // 9. Fetch Public Reveal metadata
  console.log('🎁 Verifying Recipient Reveal API...');
  const revealRes = await server.inject({
    method: 'GET',
    url: `/public/reveals/${sealed.id}`
  });
  
  if (revealRes.statusCode === 200) {
    console.log(`✅ Reveal payload successfully resolved: ${JSON.parse(revealRes.payload).mode}`);
  } else {
    console.error(`❌ Reveal failed: ${revealRes.payload}`);
    process.exit(1);
  }

  console.log('🎉 E2E SIMULATION SUCCESSFUL!');
  process.exit(0);
}

runE2E().catch(console.error);
