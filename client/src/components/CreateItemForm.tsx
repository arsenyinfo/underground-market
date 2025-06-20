import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import type { CreateMarketplaceItemInput, ItemCategory, ItemCondition, MarketplaceItem } from '../../../server/src/schema';

interface CreateItemFormProps {
  onSuccess?: (item: MarketplaceItem) => void;
  onCancel?: () => void;
}

export function CreateItemForm({ onSuccess, onCancel }: CreateItemFormProps) {
  const [formData, setFormData] = useState<CreateMarketplaceItemInput>({
    title: '',
    description: '',
    price: 0,
    category: 'electronics',
    condition: 'good',
    location: '',
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const categories: { value: ItemCategory; label: string; emoji: string }[] = [
    { value: 'electronics', label: 'Electronics', emoji: '⚡' },
    { value: 'bikes', label: 'Bikes', emoji: '🚲' },
    { value: 'jewelry', label: 'Jewelry', emoji: '💎' },
    { value: 'watches', label: 'Watches', emoji: '⌚' },
    { value: 'phones', label: 'Phones', emoji: '📱' },
    { value: 'laptops', label: 'Laptops', emoji: '💻' },
    { value: 'other', label: 'Other', emoji: '📦' }
  ];

  const conditions: { value: ItemCondition; label: string }[] = [
    { value: 'mint', label: 'Mint' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (formData.price <= 0) {
      setError('Price must be positive.');
      setIsSubmitting(false);
      return;
    }
    if (imageUrl && !imageUrl.startsWith('http')) {
      setError('Image URL must be a valid URL.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare submission data with proper image handling
      const submissionData: CreateMarketplaceItemInput = {
        ...formData,
        images: imageUrl ? [imageUrl] : [], // Convert single URL to array
      };

      const newItem = await trpc.createMarketplaceItem.mutate(submissionData);
      onSuccess?.(newItem);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: 'electronics',
        condition: 'good',
        location: '',
        images: [],
      });
      setImageUrl('');

    } catch (err) {
      console.error('Failed to create item:', err);
      setError('Failed to list item. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-200">List Your Item</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-950/30 border border-red-800/50 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData((prev: CreateMarketplaceItemInput) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Unlocked Smartphone, Vintage Bicycle"
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                setFormData((prev: CreateMarketplaceItemInput) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Tell us about the item, its 'history', and any 'special' features..."
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500 min-h-[80px]"
              required
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-gray-300">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData((prev: CreateMarketplaceItemInput) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
              }
              placeholder="0.00"
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-gray-300">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ItemCategory) => 
                  setFormData((prev: CreateMarketplaceItemInput) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.emoji} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition" className="text-gray-300">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value: ItemCondition) => 
                  setFormData((prev: CreateMarketplaceItemInput) => ({ ...prev, condition: value }))
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  {conditions.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="text-gray-300">Location</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData((prev: CreateMarketplaceItemInput) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Abandoned Warehouse, Old Docks"
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="images" className="text-gray-300">Image URL</Label>
            <Input
              id="images"
              type="url"
              value={imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
              placeholder="https://example.com/item.jpg"
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Provide a direct link to an image. (Optional)</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              {isSubmitting ? 'Listing...' : '💰 List Item'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}