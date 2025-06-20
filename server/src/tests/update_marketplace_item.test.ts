
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type CreateMarketplaceItemInput, type UpdateMarketplaceItemInput } from '../schema';
import { updateMarketplaceItem } from '../handlers/update_marketplace_item';
import { eq } from 'drizzle-orm';

// Test input for creating an initial item
const testCreateInput: CreateMarketplaceItemInput = {
  title: 'Original Mountain Bike',
  description: 'A mountain bike in great condition for outdoor adventures.',
  price: 500,
  category: 'bikes',
  condition: 'good',
  location: 'Downtown',
  images: ['https://example.com/bike.jpg']
};

describe('updateMarketplaceItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a marketplace item', async () => {
    // Create initial item
    const createResult = await db.insert(marketplaceItemsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        price: testCreateInput.price.toString(),
        category: testCreateInput.category,
        condition: testCreateInput.condition,
        location: testCreateInput.location,
        images: testCreateInput.images
      })
      .returning()
      .execute();

    const createdItem = createResult[0];

    // Update the item
    const updateInput: UpdateMarketplaceItemInput = {
      id: createdItem.id,
      title: 'Updated Mountain Bike',
      price: 600,
      condition: 'excellent'
    };

    const result = await updateMarketplaceItem(updateInput);

    // Verify update results
    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdItem.id);
    expect(result!.title).toEqual('Updated Mountain Bike');
    expect(result!.price).toEqual(600);
    expect(result!.condition).toEqual('excellent');
    expect(typeof result!.price).toEqual('number');
    
    // Verify unchanged fields remain the same
    expect(result!.description).toEqual(testCreateInput.description);
    expect(result!.category).toEqual(testCreateInput.category);
    expect(result!.location).toEqual(testCreateInput.location);
    expect(result!.images).toEqual(testCreateInput.images);
    
    // Verify updated_at is updated
    expect(result!.updated_at).toBeInstanceOf(Date);
    expect(result!.updated_at > createdItem.updated_at).toBe(true);
  });

  it('should save updated item to database', async () => {
    // Create initial item
    const createResult = await db.insert(marketplaceItemsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        price: testCreateInput.price.toString(),
        category: testCreateInput.category,
        condition: testCreateInput.condition,
        location: testCreateInput.location,
        images: testCreateInput.images
      })
      .returning()
      .execute();

    const createdItem = createResult[0];

    // Update the item
    const updateInput: UpdateMarketplaceItemInput = {
      id: createdItem.id,
      title: 'Database Updated Bike',
      is_available: false
    };

    await updateMarketplaceItem(updateInput);

    // Query database to verify the update
    const items = await db.select()
      .from(marketplaceItemsTable)
      .where(eq(marketplaceItemsTable.id, createdItem.id))
      .execute();

    expect(items).toHaveLength(1);
    expect(items[0].title).toEqual('Database Updated Bike');
    expect(items[0].is_available).toEqual(false);
    expect(items[0].updated_at).toBeInstanceOf(Date);
    expect(items[0].updated_at > createdItem.updated_at).toBe(true);
  });

  it('should return null for non-existent item', async () => {
    const updateInput: UpdateMarketplaceItemInput = {
      id: 999,
      title: 'Non-existent Item'
    };

    const result = await updateMarketplaceItem(updateInput);

    expect(result).toBeNull();
  });

  it('should update all fields when provided', async () => {
    // Create initial item
    const createResult = await db.insert(marketplaceItemsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        price: testCreateInput.price.toString(),
        category: testCreateInput.category,
        condition: testCreateInput.condition,
        location: testCreateInput.location,
        images: testCreateInput.images
      })
      .returning()
      .execute();

    const createdItem = createResult[0];

    // Update all possible fields
    const updateInput: UpdateMarketplaceItemInput = {
      id: createdItem.id,
      title: 'Completely Updated Bike',
      description: 'Updated description with more details about this awesome bike.',
      price: 750,
      category: 'electronics',
      condition: 'mint',
      location: 'Uptown',
      images: ['https://example.com/updated1.jpg', 'https://example.com/updated2.jpg'],
      is_available: false
    };

    const result = await updateMarketplaceItem(updateInput);

    // Verify all fields are updated
    expect(result).not.toBeNull();
    expect(result!.title).toEqual('Completely Updated Bike');
    expect(result!.description).toEqual('Updated description with more details about this awesome bike.');
    expect(result!.price).toEqual(750);
    expect(result!.category).toEqual('electronics');
    expect(result!.condition).toEqual('mint');
    expect(result!.location).toEqual('Uptown');
    expect(result!.images).toEqual(['https://example.com/updated1.jpg', 'https://example.com/updated2.jpg']);
    expect(result!.is_available).toEqual(false);
  });

  it('should update only provided fields and leave others unchanged', async () => {
    // Create initial item
    const createResult = await db.insert(marketplaceItemsTable)
      .values({
        title: testCreateInput.title,
        description: testCreateInput.description,
        price: testCreateInput.price.toString(),
        category: testCreateInput.category,
        condition: testCreateInput.condition,
        location: testCreateInput.location,
        images: testCreateInput.images
      })
      .returning()
      .execute();

    const createdItem = createResult[0];

    // Update only price
    const updateInput: UpdateMarketplaceItemInput = {
      id: createdItem.id,
      price: 550
    };

    const result = await updateMarketplaceItem(updateInput);

    // Verify only price is updated, other fields unchanged
    expect(result).not.toBeNull();
    expect(result!.price).toEqual(550);
    expect(result!.title).toEqual(testCreateInput.title);
    expect(result!.description).toEqual(testCreateInput.description);
    expect(result!.category).toEqual(testCreateInput.category);
    expect(result!.condition).toEqual(testCreateInput.condition);
    expect(result!.location).toEqual(testCreateInput.location);
    expect(result!.images).toEqual(testCreateInput.images);
  });
});
