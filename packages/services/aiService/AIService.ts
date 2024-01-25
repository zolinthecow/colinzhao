import OpenAI from 'openai';
import IAIService from './AIService.interface';

export default class AIService implements IAIService {
  private _openAIClient: OpenAI;

  constructor() {
    this._openAIClient = new OpenAI({
      apiKey: process.env['OPENAI_KEY'],
    });
  }

  getOpenAIClient(): OpenAI {
    return this._openAIClient;
  }
}
