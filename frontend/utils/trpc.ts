import { createTRPCReact, httpBatchLink } from '@trpc/react-query';

import type { AppRouter } from '@codechat/api-types'

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});