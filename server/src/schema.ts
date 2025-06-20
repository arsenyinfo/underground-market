
import { z } from 'zod';

// Item category enum for marketplace items
export const itemCategorySchema = z.enum([
  'electronics',
  'bikes',
  'jewelry',
  'watches',
  'phones',
  'laptops',
  'other'
]);

export type ItemCategory = z.infer<typeof itemCategorySchema>;

// Item condition enum
export const itemConditionSchema = z.enum([
  'mint',
  'excellent',
  'good',
  'fair',
  'poor'
]);

export type ItemCondition = z.infer<typeof itemConditionSchema>;

// Main marketplace item schema
export const marketplaceItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: itemCategorySchema,
  condition: itemConditionSchema,
  location: z.string(),
  images: z.array(z.string()), // Array of image URLs
  is_available: z.boolean(),
  posted_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type MarketplaceItem = z.infer<typeof marketplaceItemSchema>;

// Input schema for creating marketplace items
export const createMarketplaceItemInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  category: itemCategorySchema,
  condition: itemConditionSchema,
  location: z.string().min(1).max(100),
  images: z.array(z.string().url()).max(10) // Max 10 images
});

export type CreateMarketplaceItemInput = z.infer<typeof createMarketplaceItemInputSchema>;

// Input schema for updating marketplace items
export const updateMarketplaceItemInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().positive().optional(),
  category: itemCategorySchema.optional(),
  condition: itemConditionSchema.optional(),
  location: z.string().min(1).max(100).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  is_available: z.boolean().optional()
});

export type UpdateMarketplaceItemInput = z.infer<typeof updateMarketplaceItemInputSchema>;

// Search/filter input schema
export const searchMarketplaceItemsInputSchema = z.object({
  query: z.string().optional(),
  category: itemCategorySchema.optional(),
  condition: itemConditionSchema.optional(),
  min_price: z.number().nonnegative().optional(),
  max_price: z.number().positive().optional(),
  location: z.string().optional(),
  available_only: z.boolean().default(true),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0)
});

export type SearchMarketplaceItemsInput = z.infer<typeof searchMarketplaceItemsInputSchema>;

// Get single item input schema
export const getMarketplaceItemInputSchema = z.object({
  id: z.number()
});

export type GetMarketplaceItemInput = z.infer<typeof getMarketplaceItemInputSchema>;
