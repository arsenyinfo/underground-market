
import { ItemCard } from './ItemCard';
import type { MarketplaceItem } from '../../../server/src/schema';

interface ItemGridProps {
  items: MarketplaceItem[];
}

export function ItemGrid({ items }: ItemGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item: MarketplaceItem) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
