
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type CreateMarketplaceItemInput, type GetMarketplaceItemInput } from '../schema';
import { getMarketplaceItem } from '../handlers/get_marketplace_item';

// Test input for creating marketplace item
const testItemInput = {
  title: 'Test Laptop',
  description: 'A laptop for testing purposes with good specs',
  price: 999.99,
  category: 'laptops' as const,
  condition: 'excellent' as const,
  location: 'Test City',
  images: ['https://example.com/laptop1.jpg', 'https://example.com/laptop2.jpg']
};

describe('getMarketplaceItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return marketplace item by ID', async () => {
    // Create test item
    const inserted = await db.insert(marketplaceItemsTable)
      .values({
        ...testItemInput,
        price: testItemInput.price.toString() // Convert to string for numeric column
      })
      .returning()
      .execute();

    const testInput: GetMarketplaceItemInput = {
      id: inserted[0].id
    };

    const result = await getMarketplaceItem(testInput);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(inserted[0].id);
    expect(result!.title).toEqual('Test Laptop');
    expect(result!.description).toEqual(testItemInput.description);
    expect(result!.price).toEqual(999.99);
    expect(typeof result!.price).toBe('number');
    expect(result!.category).toEqual('laptops');
    expect(result!.condition).toEqual('excellent');
    expect(result!.location).toEqual('Test City');
    expect(result!.images).toEqual(['https://example.com/laptop1.jpg', 'https://example.com/laptop2.jpg']);
    expect(result!.is_available).toBe(true);
    expect(result!.posted_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent item', async () => {
    const testInput: GetMarketplaceItemInput = {
      id: 99999 // Non-existent ID
    };

    const result = await getMarketplaceItem(testInput);

    expect(result).toBeNull();
  });

  it('should handle different item categories and conditions', async () => {
    // Create item with different category and condition
    const bikeInput = {
      title: 'Test Mountain Bike',
      description: 'A mountain bike for testing with great suspension',
      price: 1299.50,
      category: 'bikes' as const,
      condition: 'good' as const,
      location: 'Mountain Town',
      images: ['https://example.com/bike1.jpg']
    };

    const inserted = await db.insert(marketplaceItemsTable)
      .values({
        ...bikeInput,
        price: bikeInput.price.toString()
      })
      .returning()
      .execute();

    const testInput: GetMarketplaceItemInput = {
      id: inserted[0].id
    };

    const result = await getMarketplaceItem(testInput);

    expect(result).not.toBeNull();
    expect(result!.category).toEqual('bikes');
    expect(result!.condition).toEqual('good');
    expect(result!.price).toEqual(1299.50);
    expect(typeof result!.price).toBe('number');
  });
});
