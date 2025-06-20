
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type CreateMarketplaceItemInput } from '../schema';
import { getMarketplaceItems } from '../handlers/get_marketplace_items';

// Test item data
const testItem1: CreateMarketplaceItemInput = {
  title: 'Test Mountain Bike',
  description: 'A great mountain bike for testing purposes',
  price: 299.99,
  category: 'bikes',
  condition: 'good',
  location: 'Test Location',
  images: ['https://example.com/bike1.jpg']
};

const testItem2: CreateMarketplaceItemInput = {
  title: 'Test iPhone',
  description: 'A test phone for marketplace testing',
  price: 599.00,
  category: 'phones',
  condition: 'excellent',
  location: 'Another Test Location',
  images: ['https://example.com/phone1.jpg', 'https://example.com/phone2.jpg']
};

describe('getMarketplaceItems', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all available marketplace items', async () => {
    // Insert test items
    await db.insert(marketplaceItemsTable)
      .values([
        {
          title: testItem1.title,
          description: testItem1.description,
          price: testItem1.price.toString(),
          category: testItem1.category,
          condition: testItem1.condition,
          location: testItem1.location,
          images: testItem1.images,
          is_available: true
        },
        {
          title: testItem2.title,
          description: testItem2.description,
          price: testItem2.price.toString(),
          category: testItem2.category,
          condition: testItem2.condition,
          location: testItem2.location,
          images: testItem2.images,
          is_available: true
        }
      ])
      .execute();

    const result = await getMarketplaceItems();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Test Mountain Bike');
    expect(result[0].price).toEqual(299.99);
    expect(typeof result[0].price).toBe('number');
    expect(result[0].is_available).toBe(true);
    expect(result[0].posted_at).toBeInstanceOf(Date);

    expect(result[1].title).toEqual('Test iPhone');
    expect(result[1].price).toEqual(599.00);
    expect(typeof result[1].price).toBe('number');
    expect(result[1].images).toHaveLength(2);
  });

  it('should only return available items', async () => {
    // Insert one available and one unavailable item
    await db.insert(marketplaceItemsTable)
      .values([
        {
          title: 'Available Item',
          description: 'This item is available',
          price: '100.00',
          category: 'electronics',
          condition: 'good',
          location: 'Test Location',
          images: ['https://example.com/item1.jpg'],
          is_available: true
        },
        {
          title: 'Unavailable Item',
          description: 'This item is not available',
          price: '200.00',
          category: 'electronics',
          condition: 'fair',
          location: 'Test Location',
          images: ['https://example.com/item2.jpg'],
          is_available: false
        }
      ])
      .execute();

    const result = await getMarketplaceItems();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Available Item');
    expect(result[0].is_available).toBe(true);
  });

  it('should return empty array when no items exist', async () => {
    const result = await getMarketplaceItems();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle items with empty images array', async () => {
    await db.insert(marketplaceItemsTable)
      .values({
        title: 'Item without images',
        description: 'This item has no images',
        price: '50.00',
        category: 'other',
        condition: 'fair',
        location: 'Test Location',
        images: [], // Empty array
        is_available: true
      })
      .execute();

    const result = await getMarketplaceItems();

    expect(result).toHaveLength(1);
    expect(result[0].images).toEqual([]);
    expect(Array.isArray(result[0].images)).toBe(true);
  });
});
