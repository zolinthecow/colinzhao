import OpenAI from 'openai';

export default interface IAIService {
  getOpenAIClient(): OpenAI;
}
