
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SearchMarketplaceItemsInput, ItemCategory, ItemCondition } from '../../../server/src/schema';

interface SearchFiltersProps {
  onSearch: (filters: SearchMarketplaceItemsInput) => void;
  isLoading?: boolean;
}

export function SearchFilters({ onSearch, isLoading = false }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchMarketplaceItemsInput>({
    available_only: true,
    limit: 20,
    offset: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchMarketplaceItemsInput = {
      available_only: true,
      limit: 20,
      offset: 0
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const categories: { value: ItemCategory; label: string; emoji: string }[] = [
    { value: 'electronics', label: 'Electronics', emoji: '⚡' },
    { value: 'bikes', label: 'Bikes', emoji: '🚲' },
    { value: 'jewelry', label: 'Jewelry', emoji: '💎' },
    { value: 'watches', label: 'Watches', emoji: '⌚' },
    { value: 'phones', label: 'Phones', emoji: '📱' },
    { value: 'laptops', label: 'Laptops', emoji: '💻' },
    { value: 'other', label: 'Other', emoji: '📦' }
  ];

  const conditions: { value: ItemCondition; label: string; color: string }[] = [
    { value: 'mint', label: 'Mint', color: 'bg-green-500' },
    { value: 'excellent', label: 'Excellent', color: 'bg-blue-500' },
    { value: 'good', label: 'Good', color: 'bg-yellow-500' },
    { value: 'fair', label: 'Fair', color: 'bg-orange-500' },
    { value: 'poor', label: 'Poor', color: 'bg-red-500' }
  ];

  const hasActiveFilters = filters.query || filters.category || filters.condition || 
                          filters.min_price || filters.max_price || filters.location;

  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-200 flex items-center gap-2">
            🔍 Search Underground Network
          </CardTitle>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-red-900/30 text-red-300">
              Filters Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Query */}
          <div>
            <Input
              placeholder="Search for items... (be discreet)"
              value={filters.query || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: SearchMarketplaceItemsInput) => ({ 
                  ...prev, 
                  query: e.target.value || undefined 
                }))
              }
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value: string) =>
                  setFilters((prev: SearchMarketplaceItemsInput) => ({
                    ...prev,
                    category: value === 'all' ? undefined : value as ItemCategory
                  }))
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-gray-200">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-gray-200">
                      {cat.emoji} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
              <Select
                value={filters.condition || 'all'}
                onValueChange={(value: string) =>
                  setFilters((prev: SearchMarketplaceItemsInput) => ({
                    ...prev,
                    condition: value === 'all' ? undefined : value as ItemCondition
                  }))
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-gray-200">Any Condition</SelectItem>
                  {conditions.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value} className="text-gray-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cond.color}`}></div>
                        {cond.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price Range ($)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.min_price || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters((prev: SearchMarketplaceItemsInput) => ({
                    ...prev,
                    min_price: e.target.value ? parseFloat(e.target.value) : undefined
                  }))
                }
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                min="0"
                step="0.01"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.max_price || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters((prev: SearchMarketplaceItemsInput) => ({
                    ...prev,
                    max_price: e.target.value ? parseFloat(e.target.value) : undefined
                  }))
                }
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Input
              placeholder="Location filter..."
              value={filters.location || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: SearchMarketplaceItemsInput) => ({ 
                  ...prev, 
                  location: e.target.value || undefined 
                }))
              }
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              {isLoading ? 'Searching...' : '🔍 Search Network'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={clearFilters}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
