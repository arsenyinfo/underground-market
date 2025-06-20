
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🕳️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Underground</h1>
                <p className="text-gray-400 text-sm">Marketplace</p>
              </div>
            </div>
            <Badge variant="destructive" className="ml-2">
              MOVIE PROP
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Network Active
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
