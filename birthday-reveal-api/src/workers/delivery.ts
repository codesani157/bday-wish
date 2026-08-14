import { db } from '../db';
import { deliveryJobs, celebrations } from '../db/schema';
import { lte, eq, and } from 'drizzle-orm';

async function runWorker() {
  console.log('Delivery Worker started: polling delivery_jobs...');
  
  setInterval(async () => {
    try {
      const now = new Date();
      
      const dueJobs = await db.select()
        .from(deliveryJobs)
        .where(and(lte(deliveryJobs.executeAtUtc, now), eq(deliveryJobs.status, 'pending')));

      for (const job of dueJobs) {
        await db.update(deliveryJobs).set({ status: 'processing', updatedAt: now }).where(eq(deliveryJobs.id, job.id));

        const [celebration] = await db.select().from(celebrations).where(eq(celebrations.id, job.celebrationId));

        if (!celebration || celebration.status !== 'sealed') {
          await db.update(deliveryJobs).set({ status: 'failed', lastError: 'Invalid state' }).where(eq(deliveryJobs.id, job.id));
          continue;
        }

        console.log(`[DELIVERY WORKER] Sending Birthday Reveal email to ${celebration.recipientEmail} for ${celebration.recipientName}`);
        
        await db.update(celebrations).set({ status: 'delivered', sentAt: new Date() }).where(eq(celebrations.id, celebration.id));
        await db.update(deliveryJobs).set({ status: 'completed', updatedAt: new Date() }).where(eq(deliveryJobs.id, job.id));
      }

    } catch (e) {
      console.error('Worker error:', e);
    }
  }, 10000);
}

runWorker();
