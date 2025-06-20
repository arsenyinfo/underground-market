
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ItemDetails } from './ItemDetails';
import type { MarketplaceItem } from '../../../server/src/schema';

interface ItemCardProps {
  item: MarketplaceItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      electronics: '⚡',
      bikes: '🚲',
      jewelry: '💎',
      watches: '⌚',
      phones: '📱',
      laptops: '💻',
      other: '📦'
    };
    return emojiMap[category] || '📦';
  };

  const getConditionColor = (condition: string) => {
    const colorMap: Record<string, string> = {
      mint: 'bg-green-500',
      excellent: 'bg-blue-500',
      good: 'bg-yellow-500',
      fair: 'bg-orange-500',
      poor: 'bg-red-500'
    };
    return colorMap[condition] || 'bg-gray-500';
  };

  return (
    <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 group hover:border-red-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryEmoji(item.category)}</span>
            <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
              {item.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getConditionColor(item.condition)}`}></div>
            <span className="text-xs text-gray-400 capitalize">{item.condition}</span>
          </div>
        </div>
        <CardTitle className="text-gray-200 text-lg group-hover:text-white transition-colors line-clamp-2">
          {item.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Image placeholder */}
        <div className="w-full h-32 bg-gray-800 rounded-md mb-3 flex items-center justify-center border border-gray-700">
          <div className="text-gray-500 text-center">
            <div className="text-2xl mb-1">{getCategoryEmoji(item.category)}</div>
            <div className="text-xs">No Image</div>
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500">
            📍 {item.location}
          </div>
          <div className="text-xs text-gray-500">
            {item.posted_at.toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="text-2xl font-bold text-green-400">
          ${item.price.toLocaleString()}
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-200">Item Details</DialogTitle>
            </DialogHeader>
            <ItemDetails item={item} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
