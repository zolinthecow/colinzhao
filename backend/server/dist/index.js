"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
const grpc_1 = __importDefault(require("./grpc"));
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bruh_1 = __importDefault(require("./trpcProcedures/bruh"));
const api_1 = require("@codechat/protos/dist/api");
const createContext = ({ req, res, }) => ({});
const t = server_1.initTRPC.context().create();
exports.appRouter = (0, trpc_1.router)({
    bruh: bruh_1.default,
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    console.info('STARTING SERVER');
    const app = (0, express_1.default)();
    const allowedOrigins = [
        'http://localhost:3000',
    ];
    const options = {
        origin: allowedOrigins,
    };
    try {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method');
            next();
        });
    }
    catch (err) {
        console.error('[ERROR HEADERS]:', err);
    }
    app.use((0, cors_1.default)(options));
    app.use('/trpc', trpcExpress.createExpressMiddleware({
        router: exports.appRouter,
        createContext,
    }));
    app.listen({ port: 4000 });
    const server = new grpc_js_1.Server();
    const HOST = '0.0.0.0';
    const PORT = 50051;
    server.addService(api_1.ApiServiceService, grpc_1.default);
    server.bindAsync(`${HOST}:${PORT}`, grpc_js_1.ServerCredentials.createInsecure(), (error, port) => {
        if (error)
            throw error;
        console.log('GRPC SERVER IS RUNNING ON PORT', port);
        server.start();
    });
    console.info('SERVER STARTED');
});
start();
