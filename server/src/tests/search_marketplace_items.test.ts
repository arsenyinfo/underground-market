
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { marketplaceItemsTable } from '../db/schema';
import { type SearchMarketplaceItemsInput, type CreateMarketplaceItemInput } from '../schema';
import { searchMarketplaceItems } from '../handlers/search_marketplace_items';

// Helper function to create test items
const createTestItem = async (overrides: Partial<CreateMarketplaceItemInput> = {}) => {
  const defaultItem = {
    title: 'Test Item',
    description: 'A test item for testing purposes',
    price: 100,
    category: 'electronics' as const,
    condition: 'good' as const,
    location: 'Test City',
    images: ['https://example.com/test.jpg']
  };

  const item = { ...defaultItem, ...overrides };
  
  const result = await db.insert(marketplaceItemsTable)
    .values({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      condition: item.condition,
      location: item.location,
      images: item.images,
      is_available: true
    })
    .returning()
    .execute();

  return result[0];
};

describe('searchMarketplaceItems', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all items with default search', async () => {
    // Create test items
    await createTestItem({ title: 'Laptop' });
    await createTestItem({ title: 'Phone' });

    const input: SearchMarketplaceItemsInput = {
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(2);
    expect(results[0].title).toBeDefined();
    expect(typeof results[0].price).toBe('number');
    expect(results[0].is_available).toBe(true);
  });

  it('should filter by text query in title', async () => {
    await createTestItem({ title: 'Gaming Laptop' });
    await createTestItem({ title: 'iPhone 15' });
    await createTestItem({ title: 'Mountain Bike' });

    const input: SearchMarketplaceItemsInput = {
      query: 'laptop',
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Gaming Laptop');
  });

  it('should filter by category', async () => {
    await createTestItem({ category: 'electronics' });
    await createTestItem({ category: 'bikes' });
    await createTestItem({ category: 'phones' });

    const input: SearchMarketplaceItemsInput = {
      category: 'bikes',
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].category).toEqual('bikes');
  });

  it('should filter by condition', async () => {
    await createTestItem({ condition: 'mint' });
    await createTestItem({ condition: 'good' });
    await createTestItem({ condition: 'fair' });

    const input: SearchMarketplaceItemsInput = {
      condition: 'mint',
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].condition).toEqual('mint');
  });

  it('should filter by price range', async () => {
    await createTestItem({ price: 50 });
    await createTestItem({ price: 150 });
    await createTestItem({ price: 300 });

    const input: SearchMarketplaceItemsInput = {
      min_price: 100,
      max_price: 200,
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].price).toEqual(150);
  });

  it('should filter by location', async () => {
    await createTestItem({ location: 'New York' });
    await createTestItem({ location: 'Los Angeles' });
    await createTestItem({ location: 'Chicago' });

    const input: SearchMarketplaceItemsInput = {
      location: 'york',
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].location).toEqual('New York');
  });

  it('should handle pagination correctly', async () => {
    // Create 5 test items
    for (let i = 1; i <= 5; i++) {
      await createTestItem({ title: `Item ${i}` });
    }

    // First page
    const firstPage: SearchMarketplaceItemsInput = {
      limit: 2,
      offset: 0,
      available_only: true
    };

    const firstResults = await searchMarketplaceItems(firstPage);
    expect(firstResults).toHaveLength(2);

    // Second page
    const secondPage: SearchMarketplaceItemsInput = {
      limit: 2,
      offset: 2,
      available_only: true
    };

    const secondResults = await searchMarketplaceItems(secondPage);
    expect(secondResults).toHaveLength(2);

    // Should be different items
    expect(firstResults[0].id).not.toEqual(secondResults[0].id);
  });

  it('should combine multiple filters', async () => {
    await createTestItem({
      title: 'Gaming Laptop',
      category: 'electronics',
      condition: 'excellent',
      price: 800,
      location: 'Seattle'
    });
    await createTestItem({
      title: 'Office Laptop',
      category: 'electronics',
      condition: 'good',
      price: 400,
      location: 'Portland'
    });

    const input: SearchMarketplaceItemsInput = {
      query: 'laptop',
      category: 'electronics',
      condition: 'excellent',
      min_price: 700,
      location: 'seattle',
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Gaming Laptop');
    expect(results[0].category).toEqual('electronics');
    expect(results[0].condition).toEqual('excellent');
    expect(results[0].price).toEqual(800);
    expect(results[0].location).toEqual('Seattle');
  });

  it('should return items ordered by posted_at descending', async () => {
    // Create items with slight delay to ensure different timestamps
    const item1 = await createTestItem({ title: 'First Item' });
    await new Promise(resolve => setTimeout(resolve, 10));
    const item2 = await createTestItem({ title: 'Second Item' });

    const input: SearchMarketplaceItemsInput = {
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(2);
    // Second item should come first (newer)
    expect(results[0].title).toEqual('Second Item');
    expect(results[1].title).toEqual('First Item');
  });

  it('should exclude unavailable items when available_only is true', async () => {
    // Create available item
    await createTestItem({ title: 'Available Item' });
    
    // Create unavailable item
    await db.insert(marketplaceItemsTable)
      .values({
        title: 'Unavailable Item',
        description: 'This item is not available',
        price: '100',
        category: 'electronics',
        condition: 'good',
        location: 'Test City',
        images: ['https://example.com/test.jpg'],
        is_available: false
      })
      .execute();

    const input: SearchMarketplaceItemsInput = {
      available_only: true,
      limit: 20,
      offset: 0
    };

    const results = await searchMarketplaceItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Available Item');
    expect(results[0].is_available).toBe(true);
  });
});
