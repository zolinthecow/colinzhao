import { router } from './trpc';

import bruh from './procedures/bruh';
export const appRouter = router({
  bruh,
});

export type AppRouter = typeof appRouter;
