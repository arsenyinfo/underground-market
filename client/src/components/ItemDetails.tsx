
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { MarketplaceItem } from '../../../server/src/schema';

interface ItemDetailsProps {
  item: MarketplaceItem;
}

export function ItemDetails({ item }: ItemDetailsProps) {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
          <h2 className="text-xl font-bold text-gray-200">{item.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {item.category}
          </Badge>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getConditionColor(item.condition)}`}></div>
            <span className="text-sm text-gray-400 capitalize">{item.condition} condition</span>
          </div>
          {item.is_available && (
            <Badge className="bg-green-900/30 text-green-300 border-green-800">
              Available
            </Badge>
          )}
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700">
        <div className="text-gray-500 text-center">
          <div className="text-4xl mb-2">{getCategoryEmoji(item.category)}</div>
          <div className="text-sm">No Image Available</div>
          <div className="text-xs text-gray-600 mt-1">Images removed for security</div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-300 mb-2">Description</h3>
        <p className="text-gray-400 leading-relaxed">{item.description}</p>
      </div>

      <Separator className="bg-gray-800" />

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-300 mb-1">Price</h4>
          <p className="text-2xl font-bold text-green-400">${item.price.toLocaleString()}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-300 mb-1">Location</h4>
          <p className="text-gray-400">📍 {item.location}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-300 mb-1">Posted</h4>
          <p className="text-gray-400">{item.posted_at.toLocaleDateString()}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-300 mb-1">Updated</h4>
          <p className="text-gray-400">{item.updated_at.toLocaleDateString()}</p>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Contact Section */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h3 className="font-semibold text-gray-300 mb-3">Contact Information</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>🔒 Contact details available after verification</p>
          <p>💰 Cash transactions only</p>
          <p>🌙 Meet during off-hours for discretion</p>
          <p>⚠️ No questions asked policy</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
            disabled
          >
            🔒 Contact Seller
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled
          >
            ⭐ Save
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          * Contact features disabled for movie production
        </p>
      </div>
    </div>
  );
}
