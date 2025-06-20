
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type CreateMarketplaceItemInput, type MarketplaceItem } from '../schema';

export const createMarketplaceItem = async (input: CreateMarketplaceItemInput): Promise<MarketplaceItem> => {
  try {
    // Insert marketplace item record
    const result = await db.insert(marketplaceItemsTable)
      .values({
        title: input.title,
        description: input.description,
        price: input.price.toString(), // Convert number to string for numeric column
        category: input.category,
        condition: input.condition,
        location: input.location,
        images: input.images,
        is_available: true // Default value
      })
      .returning()
      .execute();

    // Convert numeric fields back to numbers before returning
    const item = result[0];
    return {
      ...item,
      price: parseFloat(item.price) // Convert string back to number
    };
  } catch (error) {
    console.error('Marketplace item creation failed:', error);
    throw error;
  }
};
