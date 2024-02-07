import IUserService from './UserService.interface';

import prisma, { Usage } from '@colinzhao/prisma';
import { DateTime } from 'luxon';
import { ulid } from 'ulid';
import { injectable } from 'inversify';

@injectable()
export default class UserService implements IUserService {
  constructor() {}

  public getGptLimits(): { gptFour: number; gptThreeDotFive: number } {
    return {
      gptFour: 50,
      gptThreeDotFive: 200,
    };
  }

  public async createUserIfNotExisting(user: {
    id: string;
    nickname: string;
    picture: string;
  }): Promise<void> {
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (prismaUser != null) return;

    await prisma.user.create({
      data: {
        id: user.id,
        nickname: user.nickname,
        picture: user.picture,
      },
    });
  }

  public async getUsage(userId: string): Promise<Usage> {
    const result = await prisma.$transaction(async (tx) => {
      let prismaUsage = await tx.usage.findFirst({
        where: {
          userId,
          createdAt: {
            gte: DateTime.local().startOf('month').toJSDate(),
          },
        },
      });

      if (prismaUsage == null) {
        prismaUsage = await tx.usage.create({
          data: {
            id: ulid(),
            userId,
            gptFourCalls: 0,
            gptThreeDotFiveCalls: 0,
            createdAt: DateTime.now().toISO(),
          },
        });
      }

      return prismaUsage;
    });

    return result;
  }

  public async incrementUsage(
    userId: string,
    modelType: 'gpt4' | 'gpt3.5',
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      let prismaCurrentMonthUsage = await tx.usage.findFirst({
        where: {
          userId,
          createdAt: {
            gte: DateTime.local().startOf('month').toJSDate(),
          },
        },
      });

      if (prismaCurrentMonthUsage == null) {
        prismaCurrentMonthUsage = await tx.usage.create({
          data: {
            id: ulid(),
            userId,
            gptFourCalls: 0,
            gptThreeDotFiveCalls: 0,
            createdAt: DateTime.now().toISO(),
          },
        });
      }

      await tx.usage.update({
        where: {
          id: prismaCurrentMonthUsage.id,
        },
        data: {
          gptFourCalls:
            prismaCurrentMonthUsage.gptFourCalls +
            (modelType === 'gpt4' ? 1 : 0),
          gptThreeDotFiveCalls:
            prismaCurrentMonthUsage.gptThreeDotFiveCalls +
            (modelType === 'gpt3.5' ? 1 : 0),
        },
      });
    });
  }
}
