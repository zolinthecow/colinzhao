"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCallbackImplementation = exports.ServerError = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
class ServerError extends Error {
    constructor(message, code) {
        super(message);
        this.code = grpc_js_1.status.UNKNOWN;
        Object.setPrototypeOf(this, ServerError.prototype);
        this.code = code;
    }
}
exports.ServerError = ServerError;
const toCallbackImplementation = (implementation) => {
    return (call, callback) => {
        implementation(call.request)
            .then((res) => {
            callback(null, res);
        })
            .catch((err) => {
            if (!(err instanceof ServerError)) {
                callback({ code: grpc_js_1.status.UNKNOWN }, null);
                return;
            }
            callback({ code: err.code, details: err.message }, null);
        });
    };
};
exports.toCallbackImplementation = toCallbackImplementation;
