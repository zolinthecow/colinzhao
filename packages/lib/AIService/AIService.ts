import OpenAI from 'openai';
import IAIService from './AIService.interface';

class _AIService implements IAIService {
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

const AIService = new _AIService();

export default AIService;
