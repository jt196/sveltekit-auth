import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Better Auth core tables for SQLite

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt').notNull(),
  updatedAt: integer('updatedAt').notNull()
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt').notNull(),
  createdAt: integer('createdAt').notNull(),
  updatedAt: integer('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent')
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  providerId: text('providerId').notNull(),
  accountId: text('accountId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt'),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt').notNull(),
  updatedAt: integer('updatedAt').notNull()
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt').notNull(),
  createdAt: integer('createdAt'),
  updatedAt: integer('updatedAt')
});
