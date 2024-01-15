import { router } from './trpc';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cors from 'cors';

import bruh from './trpcProcedures/bruh';

import setStreamChatResponse from 'rest/streamChatResponse';

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();
export const appRouter = router({
  bruh,
});

export type AppRouter = typeof appRouter;

// Export type router type signature,
// NOT the router itself.

const start = async () => {
  console.info('STARTING SERVER');

  const app = express();

// Add a list of allowed origins.
  // If you have more origins you would like to add, you can add them to the array below.
  const allowedOrigins = [
    'http://localhost:3000',
  ];

  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };

  // Then pass these options to cors:

  try {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, Authorization, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method'
      );
      next();
    });
  } catch (err) {
    console.error('[ERROR HEADERS]:', err);
  }

  app.use((req, res, next) => express.json({ limit: '1mb' })(req, res, next));

  app.use(cors(options));

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  setStreamChatResponse(app);

  app.listen({ port: 4000 });

  console.info('SERVER STARTED');
};

start();