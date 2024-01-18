import { inject, injectable } from "inversify";
import "reflect-metadata";
import type IAIService from "../aiService/AIService.interface";
import IApiService from "./ApiService.interface";
import { TYPES } from "../serviceTypes";
import { RestTypes } from "@codechat/api-types";

@injectable()
export default class ApiService implements IApiService {

  private _apiUrl: string;

  constructor(
  ) {
    if (process.env.NODE_ENV === 'development') this._apiUrl = `http://localhost:4000/`;
    else this._apiUrl = `http://localhost:4000/`;
  }

  getApiUrl(): string {
    return this._apiUrl;
  }

  createFetch(input: string, init?: RequestInit | undefined): Promise<Response> {
    return fetch(`${this._apiUrl}${input}`, init);
  }

  async fetch<T extends keyof RestTypes>(input: T, init?: RequestInit | undefined): Promise<RestTypes[T]["response"]> {
    const resp = await this.createFetch(input, init);
    return resp.json() as unknown as RestTypes[typeof input]['response'];
  }
  
  async generateStream<T extends keyof RestTypes>(input: T, request?: RestTypes[T]['request'], init?: RequestInit | undefined): Promise<AsyncIterable<Array<RestTypes[T]['response']>>> {
    const _init: RequestInit = { headers: { 'Content-Type': 'application/json' }, ...init };

    if (request !== 'UNKNOWN') {
      if (request?.body) {
        _init.body = JSON.stringify(request.body);
      }
    }
    const resp = await fetch(`${this._apiUrl}${input}`, _init); 

    if (resp.status !== 200) throw new Error(resp.status.toString());
    if (!resp.body) throw new Error('Missing response body');

    return this._getIterableStream<T>(resp.body);
  }

  private async* _getIterableStream<T extends keyof RestTypes>(body: ReadableStream<Uint8Array>): AsyncIterable<Array<RestTypes[T]['response']>> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = decoder.decode(value, { stream: true });

      console.log('DECODED CHUNK', decodedChunk);

      const chunkArray = this._splitJsonString(decodedChunk);

      yield chunkArray.map(c => JSON.parse(c) as unknown as RestTypes[T]['response']);
    }
  }

  private _splitJsonString(input: string): string[] {
    const results: string[] = [];
    let braceCount = 0;
    let currentObject = '';

    for (const char of input) {
        if (char === '{') {
            braceCount++;
        }

        if (braceCount > 0) {
            currentObject += char;
        }

        if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
                results.push(currentObject);
                currentObject = '';
            }
        }
    }

    return results;
}
};
