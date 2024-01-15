"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env['OPENAI_KEY'],
});
const apiServiceServer = {
    streamAiChat: (call) => {
        const req = call.request;
        const message = req.message;
        const stream = openai.beta.chat.completions.stream({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            stream: true,
        });
        stream.on('content', (delta, snapshot) => {
            call.write({ content: delta });
        });
    },
};
exports.default = apiServiceServer;
