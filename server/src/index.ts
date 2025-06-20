
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  createMarketplaceItemInputSchema,
  updateMarketplaceItemInputSchema,
  searchMarketplaceItemsInputSchema,
  getMarketplaceItemInputSchema
} from './schema';

// Import handlers
import { createMarketplaceItem } from './handlers/create_marketplace_item';
import { getMarketplaceItems } from './handlers/get_marketplace_items';
import { getMarketplaceItem } from './handlers/get_marketplace_item';
import { searchMarketplaceItems } from './handlers/search_marketplace_items';
import { updateMarketplaceItem } from './handlers/update_marketplace_item';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new marketplace item
  createMarketplaceItem: publicProcedure
    .input(createMarketplaceItemInputSchema)
    .mutation(({ input }) => createMarketplaceItem(input)),
  
  // Get all marketplace items
  getMarketplaceItems: publicProcedure
    .query(() => getMarketplaceItems()),
  
  // Get a single marketplace item by ID
  getMarketplaceItem: publicProcedure
    .input(getMarketplaceItemInputSchema)
    .query(({ input }) => getMarketplaceItem(input)),
  
  // Search and filter marketplace items
  searchMarketplaceItems: publicProcedure
    .input(searchMarketplaceItemsInputSchema)
    .query(({ input }) => searchMarketplaceItems(input)),
  
  // Update an existing marketplace item
  updateMarketplaceItem: publicProcedure
    .input(updateMarketplaceItemInputSchema)
    .mutation(({ input }) => updateMarketplaceItem(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Underground Marketplace TRPC server listening at port: ${port}`);
}

start();
