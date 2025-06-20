
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { ItemGrid } from '@/components/ItemGrid';
import { SearchFilters } from '@/components/SearchFilters';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateItemForm } from '@/components/CreateItemForm';
import type { MarketplaceItem, SearchMarketplaceItemsInput } from '../../server/src/schema';

function App() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchMarketplaceItemsInput>({
    available_only: true,
    limit: 20,
    offset: 0
  });
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use search with current filters, fallback to getAll if no filters
      const hasFilters = searchFilters.query || searchFilters.category || 
                        searchFilters.condition || searchFilters.min_price || 
                        searchFilters.max_price || searchFilters.location;
      
      let result: MarketplaceItem[];
      if (hasFilters) {
        result = await trpc.searchMarketplaceItems.query(searchFilters);
      } else {
        result = await trpc.getMarketplaceItems.query();
      }
      
      setItems(result);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchFilters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSearch = (filters: SearchMarketplaceItemsInput) => {
    setSearchFilters(filters);
  };

  const handleItemCreated = (newItem: MarketplaceItem) => {
    // Refresh the list after a new item is created
    loadItems();
    setIsCreateFormOpen(false);
    console.log('New item listed:', newItem.title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23333333%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Warning banner */}
          <div className="mb-8 p-4 bg-red-950/30 border border-red-800/50 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div>
                <h3 className="text-red-300 font-semibold">Disclaimer</h3>
                <p className="text-red-200/80 text-sm">
                  This is a fictional marketplace for movie purposes only. All items and descriptions are part of a creative production.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <SearchFilters onSearch={handleSearch} isLoading={isLoading} />
            <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg text-lg px-8 py-3 w-full md:w-auto animate-pulse-glow"
                >
                  ➕ List Your Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-gray-200 max-w-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl text-gray-100">Create New Listing</DialogTitle>
                </DialogHeader>
                <CreateItemForm onSuccess={handleItemCreated} onCancel={() => setIsCreateFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mt-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-solid border-current border-e-transparent"></div>
                <p className="mt-4 text-gray-400">Loading underground inventory...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🕵️‍♂️</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Nothing Found</h3>
                <p className="text-gray-500">The network is quiet right now. Check back later.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-200">
                    Available Items ({items.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <ItemGrid items={items} />
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-gray-500 text-sm">
              <p>🎬 Underground Marketplace - For Movie Production Only</p>
              <p className="mt-1">All transactions are fictional and for entertainment purposes.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
