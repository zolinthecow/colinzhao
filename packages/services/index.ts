import { container } from "./inversify.config";
import { TYPES } from "./serviceTypes";

// interfaces
import IAIService from "./aiService/AIService.interface";

const aiService = container.get<IAIService>(TYPES.AIService);

const serviceCollection = {
  aiService,
};

export default serviceCollection;
