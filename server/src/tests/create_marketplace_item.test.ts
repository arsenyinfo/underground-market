
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type CreateMarketplaceItemInput } from '../schema';
import { createMarketplaceItem } from '../handlers/create_marketplace_item';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateMarketplaceItemInput = {
  title: 'iPhone 15 Pro',
  description: 'Brand new iPhone 15 Pro in excellent condition with original packaging',
  price: 999.99,
  category: 'phones',
  condition: 'mint',
  location: 'San Francisco, CA',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
};

describe('createMarketplaceItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a marketplace item', async () => {
    const result = await createMarketplaceItem(testInput);

    // Basic field validation
    expect(result.title).toEqual('iPhone 15 Pro');
    expect(result.description).toEqual(testInput.description);
    expect(result.price).toEqual(999.99);
    expect(typeof result.price).toEqual('number');
    expect(result.category).toEqual('phones');
    expect(result.condition).toEqual('mint');
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.images).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
    expect(result.is_available).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.posted_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save marketplace item to database', async () => {
    const result = await createMarketplaceItem(testInput);

    // Query using proper drizzle syntax
    const items = await db.select()
      .from(marketplaceItemsTable)
      .where(eq(marketplaceItemsTable.id, result.id))
      .execute();

    expect(items).toHaveLength(1);
    expect(items[0].title).toEqual('iPhone 15 Pro');
    expect(items[0].description).toEqual(testInput.description);
    expect(parseFloat(items[0].price)).toEqual(999.99);
    expect(items[0].category).toEqual('phones');
    expect(items[0].condition).toEqual('mint');
    expect(items[0].location).toEqual('San Francisco, CA');
    expect(items[0].images).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
    expect(items[0].is_available).toBe(true);
    expect(items[0].posted_at).toBeInstanceOf(Date);
    expect(items[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle different categories and conditions', async () => {
    const bikeInput: CreateMarketplaceItemInput = {
      title: 'Mountain Bike',
      description: 'Used mountain bike in good condition, great for trails',
      price: 299.50,
      category: 'bikes',
      condition: 'good',
      location: 'Portland, OR',
      images: ['https://example.com/bike.jpg']
    };

    const result = await createMarketplaceItem(bikeInput);

    expect(result.category).toEqual('bikes');
    expect(result.condition).toEqual('good');
    expect(result.price).toEqual(299.50);
    expect(result.images).toHaveLength(1);
  });

  it('should handle empty images array', async () => {
    const noImagesInput: CreateMarketplaceItemInput = {
      title: 'Vintage Watch',
      description: 'Classic vintage watch from the 1970s in fair condition',
      price: 150.00,
      category: 'watches',
      condition: 'fair',
      location: 'New York, NY',
      images: []
    };

    const result = await createMarketplaceItem(noImagesInput);

    expect(result.images).toEqual([]);
    expect(result.category).toEqual('watches');
    expect(result.condition).toEqual('fair');
  });
});
