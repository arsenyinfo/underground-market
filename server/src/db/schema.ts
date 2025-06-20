
import { serial, text, pgTable, timestamp, numeric, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Define enums for the database
export const itemCategoryEnum = pgEnum('item_category', [
  'electronics',
  'bikes', 
  'jewelry',
  'watches',
  'phones',
  'laptops',
  'other'
]);

export const itemConditionEnum = pgEnum('item_condition', [
  'mint',
  'excellent', 
  'good',
  'fair',
  'poor'
]);

// Marketplace items table
export const marketplaceItemsTable = pgTable('marketplace_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  category: itemCategoryEnum('category').notNull(),
  condition: itemConditionEnum('condition').notNull(),
  location: text('location').notNull(),
  images: text('images').array().notNull().default([]), // Array of image URLs
  is_available: boolean('is_available').notNull().default(true),
  posted_at: timestamp('posted_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schema
export type MarketplaceItem = typeof marketplaceItemsTable.$inferSelect;
export type NewMarketplaceItem = typeof marketplaceItemsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { 
  marketplaceItems: marketplaceItemsTable 
};
