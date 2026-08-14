import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';

export const senders = pgTable('senders', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const senderSessions = pgTable('sender_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => senders.id),
  refreshTokenHash: text('refresh_token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const magicLinkTokens = pgTable('magic_link_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const worlds = pgTable('worlds', {
  id: uuid('id').defaultRandom().primaryKey(),
  worldKey: text('world_key').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  physicsConfig: jsonb('physics_config'),
  assetManifest: jsonb('asset_manifest'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const celebrations = pgTable('celebrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => senders.id),
  worldId: uuid('world_id').notNull().references(() => worlds.id),
  recipientName: text('recipient_name').notNull(),
  recipientEmail: text('recipient_email').notNull(),
  recipientBirthdate: text('recipient_birthdate').notNull(),
  recipientTimezone: text('recipient_timezone').notNull(),
  status: text('status').notNull().default('draft'),
  headline: text('headline'),
  messageBody: text('message_body'),
  musicUrl: text('music_url'),
  memoryPromptQuestion: text('memory_prompt_question'),
  memoryPromptAnswerHash: text('memory_prompt_answer_hash'),
  scheduledSendAtUtc: timestamp('scheduled_send_at_utc'),
  revealAvailableAtUtc: timestamp('reveal_available_at_utc'),
  sentAt: timestamp('sent_at'),
  firstOpenedAt: timestamp('first_opened_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const celebrationMedia = pgTable('celebration_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  celebrationId: uuid('celebration_id').notNull().references(() => celebrations.id),
  storageKey: text('storage_key').notNull(),
  originalFilename: text('original_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  width: integer('width'),
  height: integer('height'),
  uploadStatus: text('upload_status').notNull().default('pending'), // pending, confirmed, failed
  cdnUrl: text('cdn_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deliveryJobs = pgTable('delivery_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  celebrationId: uuid('celebration_id').notNull().references(() => celebrations.id),
  status: text('status').notNull().default('pending'), // pending, claimed, processing, completed, failed
  executeAtUtc: timestamp('execute_at_utc').notNull(),
  lockedAtUtc: timestamp('locked_at_utc'),
  attempts: integer('attempts').notNull().default(0),
  lastError: text('last_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const revealEvents = pgTable('reveal_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  celebrationId: uuid('celebration_id').notNull().references(() => celebrations.id),
  eventType: text('event_type').notNull(), // link_opened, tier_detected, swoop_started, unwrap_started, completed
  eventData: jsonb('event_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
