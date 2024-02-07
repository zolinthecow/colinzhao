import OpenAI from 'openai';
import IAIService from './AIService.interface';
import { injectable } from 'inversify';

@injectable()
export default class AIService implements IAIService {
  private _openAIClient: OpenAI;

  constructor() {
    this._openAIClient = new OpenAI({
      apiKey: process.env['OPENAI_KEY'],
    });
  }

  public getOpenAIClient(): OpenAI {
    return this._openAIClient;
  }
}
