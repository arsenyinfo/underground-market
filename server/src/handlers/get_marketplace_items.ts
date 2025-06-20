
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type MarketplaceItem } from '../schema';
import { eq } from 'drizzle-orm';

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    // Query for all available marketplace items
    const results = await db.select()
      .from(marketplaceItemsTable)
      .where(eq(marketplaceItemsTable.is_available, true))
      .execute();

    // Convert numeric fields back to numbers before returning
    return results.map(item => ({
      ...item,
      price: parseFloat(item.price) // Convert string back to number
    }));
  } catch (error) {
    console.error('Get marketplace items failed:', error);
    throw error;
  }
}
