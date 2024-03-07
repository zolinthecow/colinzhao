export type StreamResponseChunk<T> = {
  iteratorResult: IteratorResult<T>;
  next?: Promise<StreamResponseChunk<T>>;
};

async function streamChunk<T>(generator: AsyncGenerator<T>) {
  const next = generator.next();
  return new Promise<StreamResponseChunk<T>>((resolve, reject) => {
    next.then((res) => {
      if (res.done) resolve({ iteratorResult: res });
      else resolve({ iteratorResult: res, next: streamChunk(generator) });
    });
    next.catch((e) => reject(e));
  });
}

// Use in server action to create a stream response
// eslint-disable-next-line
export function streamResponse<T, P extends any[]>(
  createGenerator: (
    ...args: P
  ) => AsyncGenerator<T> | Promise<AsyncGenerator<T>>,
) {
  return async (...args: Parameters<typeof createGenerator>) => {
    const generator = await createGenerator(...args);
    return streamChunk<T>(generator);
  };
}

// Use in client to unwrap the stream response
export function iterateStreamResponse<T>(
  streamResponse: Promise<StreamResponseChunk<T>>,
) {
  return {
    [Symbol.asyncIterator]: function () {
      return {
        current: streamResponse,
        async next() {
          const { iteratorResult, next } = await this.current;

          if (next) this.current = next;
          else iteratorResult.done = true;

          return iteratorResult;
        },
      };
    },
  };
}
