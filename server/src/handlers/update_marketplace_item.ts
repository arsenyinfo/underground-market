
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type UpdateMarketplaceItemInput, type MarketplaceItem } from '../schema';
import { eq, sql } from 'drizzle-orm';

export const updateMarketplaceItem = async (input: UpdateMarketplaceItemInput): Promise<MarketplaceItem | null> => {
  try {
    // First check if the item exists
    const existingItem = await db.select()
      .from(marketplaceItemsTable)
      .where(eq(marketplaceItemsTable.id, input.id))
      .execute();

    if (existingItem.length === 0) {
      return null;
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    
    if (input.title !== undefined) {
      updateData['title'] = input.title;
    }
    if (input.description !== undefined) {
      updateData['description'] = input.description;
    }
    if (input.price !== undefined) {
      updateData['price'] = input.price.toString(); // Convert number to string for numeric column
    }
    if (input.category !== undefined) {
      updateData['category'] = input.category;
    }
    if (input.condition !== undefined) {
      updateData['condition'] = input.condition;
    }
    if (input.location !== undefined) {
      updateData['location'] = input.location;
    }
    if (input.images !== undefined) {
      updateData['images'] = input.images;
    }
    if (input.is_available !== undefined) {
      updateData['is_available'] = input.is_available;
    }

    // Always update the updated_at timestamp
    updateData['updated_at'] = sql`now()`;

    // Perform the update
    const result = await db.update(marketplaceItemsTable)
      .set(updateData)
      .where(eq(marketplaceItemsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      return null;
    }

    // Convert numeric fields back to numbers before returning
    const updatedItem = result[0];
    return {
      ...updatedItem,
      price: parseFloat(updatedItem.price) // Convert string back to number
    };
  } catch (error) {
    console.error('Marketplace item update failed:', error);
    throw error;
  }
};
