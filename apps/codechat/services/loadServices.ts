import { container } from './inversify.config';
import { TYPES } from './serviceTypes';

// interfaces
import IAIService from './aiService/AIService.interface';
import IApiService from './apiService/ApiService.interface';

const aiService = container.get<IAIService>(TYPES.AIService);
const apiService = container.get<IApiService>(TYPES.ApiService);

const serviceCollection = {
  aiService,
  apiService,
};

export default serviceCollection;
