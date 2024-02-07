import 'reflect-metadata';

import { Container } from 'inversify';
import { TYPES } from './serviceTypes';

// Interfaces
import IAIService from './aiService/AIService.interface';
import IUserService from './userService/UserService.interface';
import IChatService from './chatService/ChatService.interface';

// Entities
import AIService from './aiService/AIService';
import UserService from './userService/UserService';
import ChatService from './chatService/ChatService';

const container = new Container();
container.bind<IAIService>(TYPES.AIService).to(AIService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);

export { container };
