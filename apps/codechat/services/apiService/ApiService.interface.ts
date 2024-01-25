import { RestTypes } from '@colinzhao/api-types';

export default interface IApiService {
  getApiUrl(): string;
  fetch<T extends keyof RestTypes>(
    input: T,
    init?: RequestInit | undefined,
  ): Promise<RestTypes[T]['response']>;
  generateStream<T extends keyof RestTypes>(
    input: T,
    request?: RestTypes[T]['request'],
    init?: RequestInit | undefined,
  ): Promise<AsyncIterable<Array<RestTypes[T]['response']>>>;
}
