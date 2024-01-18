import { Container } from "inversify";
import { TYPES } from "./serviceTypes";

// Interfaces
import IAIService from "./aiService/AIService.interface";

// Entities
import AIService from "./aiService/AIService";

const container = new Container();
container.bind<IAIService>(TYPES.AIService).to(AIService);

export { container }