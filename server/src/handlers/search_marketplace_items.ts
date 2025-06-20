
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type SearchMarketplaceItemsInput, type MarketplaceItem } from '../schema';
import { and, eq, gte, lte, ilike, desc, type SQL } from 'drizzle-orm';

export const searchMarketplaceItems = async (input: SearchMarketplaceItemsInput): Promise<MarketplaceItem[]> => {
  try {
    // Build conditions array
    const conditions: SQL<unknown>[] = [];

    // Text search in title and description
    if (input.query) {
      conditions.push(
        ilike(marketplaceItemsTable.title, `%${input.query}%`)
      );
    }

    // Category filter
    if (input.category) {
      conditions.push(eq(marketplaceItemsTable.category, input.category));
    }

    // Condition filter
    if (input.condition) {
      conditions.push(eq(marketplaceItemsTable.condition, input.condition));
    }

    // Price range filters
    if (input.min_price !== undefined) {
      conditions.push(gte(marketplaceItemsTable.price, input.min_price.toString()));
    }

    if (input.max_price !== undefined) {
      conditions.push(lte(marketplaceItemsTable.price, input.max_price.toString()));
    }

    // Location filter (partial match)
    if (input.location) {
      conditions.push(ilike(marketplaceItemsTable.location, `%${input.location}%`));
    }

    // Available only filter
    if (input.available_only) {
      conditions.push(eq(marketplaceItemsTable.is_available, true));
    }

    // Build the final query
    const baseQuery = db.select().from(marketplaceItemsTable);
    
    const queryWithConditions = conditions.length > 0 
      ? baseQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions))
      : baseQuery;

    const results = await queryWithConditions
      .orderBy(desc(marketplaceItemsTable.posted_at))
      .limit(input.limit)
      .offset(input.offset)
      .execute();

    // Convert numeric fields back to numbers
    return results.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));
  } catch (error) {
    console.error('Marketplace items search failed:', error);
    throw error;
  }
};
