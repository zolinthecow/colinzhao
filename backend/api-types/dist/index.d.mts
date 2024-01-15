import * as _trpc_server from '@trpc/server';

declare const appRouter: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
    ctx: object;
    meta: object;
    errorShape: _trpc_server.DefaultErrorShape;
    transformer: _trpc_server.DefaultDataTransformer;
}>, {
    bruh: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: _trpc_server.DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            text: string;
        };
        _input_out: {
            text: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, string>;
}>;
type AppRouter = typeof appRouter;

type RestTypes = {
    'stream-chat-response': {
        request: {
            body: {
                content: string;
            };
        };
        response: {
            type: 'AI' | 'USER';
            id: string;
            message: string;
        };
    };
    'UNKNOWN': {
        request: 'UNKNOWN';
        response: 'UNKNOWN';
    };
};

export type { AppRouter, RestTypes };
