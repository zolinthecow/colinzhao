import { Usage } from '@colinzhao/prisma';

export default interface IUserService {
  getGptLimits(): {
    gptFour: number;
    gptThreeDotFive: number;
  };
  createUserIfNotExisting(user: {
    id: string;
    nickname: string;
    picture: string;
  }): Promise<void>;
  getUsage(userId: string): Promise<Usage>;
  incrementUsage(userId: string, modelType: 'gpt4' | 'gpt3.5'): Promise<void>;
}
