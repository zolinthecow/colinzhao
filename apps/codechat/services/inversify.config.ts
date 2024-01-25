import { Container } from 'inversify';
import { TYPES } from './serviceTypes';

// Interfaces
import IAIService from './aiService/AIService.interface';
import IApiService from './apiService/ApiService.interface';

// Entities
import AIService from './aiService/AIService';
import ApiService from './apiService/ApiService';

const container = new Container();
container.bind<IAIService>(TYPES.AIService).to(AIService);
container.bind<IApiService>(TYPES.ApiService).to(ApiService);

export { container };
