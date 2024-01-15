import {
  type sendUnaryData,
  type ServerUnaryCall,
  status,
} from '@grpc/grpc-js';

// https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
export class ServerError extends Error {
  public code: status = status.UNKNOWN;

  constructor(message: string, code: status) {
    super(message);
    Object.setPrototypeOf(this, ServerError.prototype);

    this.code = code;
  }
}

/**
 * Promise-based gRPC endpoint implmentations should have this type to work with toCallbackImplementation.
 * Throwing a ServerError will set the status code and message of the response.
 */
export type PromiseImplementation<RequestType, ResponseType> = (
  _: RequestType
) => Promise<ResponseType>;

/**
 * Converts a Promise-based gRPC endpoint implementation to a callback-based one that gRPC accepts.
 * Throwing a ServerError will set the status code and message of the response.
 */
export const toCallbackImplementation = <RequestType, ResponseType>(
  implementation: PromiseImplementation<RequestType, ResponseType>
) => {
  return (
    call: ServerUnaryCall<RequestType, ResponseType>,
    callback: sendUnaryData<ResponseType>
  ) => {
    implementation(call.request)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        if (!(err instanceof ServerError)) {
          // eslint-disable-next-line n/no-callback-literal
          callback({ code: status.UNKNOWN }, null);
          return;
        }
        // eslint-disable-next-line n/no-callback-literal
        callback({ code: err.code, details: err.message }, null);
      });
  };
};
