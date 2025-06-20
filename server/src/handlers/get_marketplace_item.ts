
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type GetMarketplaceItemInput, type MarketplaceItem } from '../schema';

export const getMarketplaceItem = async (input: GetMarketplaceItemInput): Promise<MarketplaceItem | null> => {
  try {
    const results = await db.select()
      .from(marketplaceItemsTable)
      .where(eq(marketplaceItemsTable.id, input.id))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    const item = results[0];

    // Convert numeric fields back to numbers
    return {
      ...item,
      price: parseFloat(item.price)
    };
  } catch (error) {
    console.error('Failed to get marketplace item:', error);
    throw error;
  }
};
