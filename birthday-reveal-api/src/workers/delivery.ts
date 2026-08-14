import { db } from '../db';
import { deliveryJobs, celebrations } from '../db/schema';
import { lte, eq, and, sql } from 'drizzle-orm';

async function runWorker() {
  console.log('Delivery Worker started: polling delivery_jobs with SKIP LOCKED...');
  
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Use transaction to atomically claim jobs with SKIP LOCKED
      await db.transaction(async (tx) => {
        // Raw SQL for FOR UPDATE SKIP LOCKED
        const claimed = await tx.execute(
          sql`SELECT id, celebration_id as "celebrationId" FROM delivery_jobs 
              WHERE status = 'pending' AND execute_at_utc <= ${now.toISOString()}
              FOR UPDATE SKIP LOCKED LIMIT 10`
        ) as any;
        
        const jobs = claimed.rows as { id: string, celebrationId: string }[];
        
        for (const job of jobs) {
          // Update status to processing immediately
          await tx.update(deliveryJobs)
            .set({ status: 'processing', updatedAt: now })
            .where(eq(deliveryJobs.id, job.id));

          const [celebration] = await tx.select()
            .from(celebrations)
            .where(eq(celebrations.id, job.celebrationId));

          if (!celebration || (celebration.status !== 'sealed' && celebration.status !== 'delivered')) {
            await tx.update(deliveryJobs)
              .set({ status: 'failed', lastError: 'Invalid state (not sealed or delivered)' })
              .where(eq(deliveryJobs.id, job.id));
            continue;
          }

          // Idempotency check: If already delivered, just mark job complete
          if (celebration.status === 'delivered') {
            await tx.update(deliveryJobs)
              .set({ status: 'completed', updatedAt: new Date() })
              .where(eq(deliveryJobs.id, job.id));
            continue;
          }

          const idempotencyKey = `email_send_${celebration.id}`;
          console.log(`[DELIVERY WORKER] Sending Birthday Reveal email to ${celebration.recipientEmail} for ${celebration.recipientName}. (Idempotency Key: ${idempotencyKey})`);
          
          // Simulation of sending email... (using idempotencyKey in the email provider call)
          
          await tx.update(celebrations)
            .set({ status: 'delivered', sentAt: new Date() })
            .where(eq(celebrations.id, celebration.id));
            
          await tx.update(deliveryJobs)
            .set({ status: 'completed', updatedAt: new Date() })
            .where(eq(deliveryJobs.id, job.id));
        }
      });
    } catch (e) {
      console.error('Worker error:', e);
    }
  }, 10000);
}

runWorker();
