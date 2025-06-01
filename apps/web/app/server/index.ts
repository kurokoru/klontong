import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/router';

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      // change to env
      url: 'http://localhost:3001/trpc',
    }),
  ],
});