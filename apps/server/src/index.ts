import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { Hono } from 'hono';
import { createContext } from './context';
import { appRouter } from './router';
import { serve } from '@hono/node-server';

const app = new Hono();

app.all('/trpc/*', async (c) => {
  return await fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => createContext(c),
  });
});

serve({
  port: 3001,
  fetch: app.fetch,
});
