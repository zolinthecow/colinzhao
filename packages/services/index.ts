import { container } from './inversify.config';
import { TYPES } from './serviceTypes';

// interfaces
import IAIService from './aiService/AIService.interface';
import IUserService from './userService/UserService.interface';
import IChatService from './chatService/ChatService.interface';

const aiService = container.get<IAIService>(TYPES.AIService);
const userService = container.get<IUserService>(TYPES.UserService);
const chatService = container.get<IChatService>(TYPES.ChatService);

const serviceCollection = {
  aiService,
  userService,
  chatService,
};

export default serviceCollection;
