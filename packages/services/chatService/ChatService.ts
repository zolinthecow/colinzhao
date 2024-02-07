import IChatService from './ChatService.interface';

import prisma, {
  Chat,
  ChatMessage,
  ChatMessageType,
  ChatMessageStatus,
} from '@colinzhao/prisma';
import { ulid } from 'ulid';

import { inject, injectable } from 'inversify';
import type IAIService from '../aiService/AIService.interface';
import type IUserService from '../userService/UserService.interface';
import { TYPES } from '../serviceTypes';
import { DateTime } from 'luxon';

@injectable()
export default class ChatService implements IChatService {
  private _aiService: IAIService;
  private _userService: IUserService;

  public constructor(
    @inject(TYPES.AIService) aiService: IAIService,
    @inject(TYPES.UserService) userService: IUserService,
  ) {
    this._aiService = aiService;
    this._userService = userService;

    this.createChatMessage = this.createChatMessage.bind(this);
  }

  public async listUserChats(
    userId: string,
    nextToken?: string,
  ): Promise<{ chats: Chat[]; nextToken: string | undefined }> {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: 'desc',
      },
      take: 25,
      skip: nextToken ? 1 : 0,
      cursor: nextToken
        ? {
            id: nextToken,
          }
        : undefined,
    });

    return {
      chats,
      nextToken: chats.length > 0 ? chats[chats.length - 1].id : undefined,
    };
  }

  public async getChat(
    chatId: string,
    messagesNextToken?: number,
  ): Promise<{
    chat: Chat & { messages: ChatMessage[] };
    messagesNextToken: number | undefined;
  }> {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          where: {
            chatId,
          },
          orderBy: {
            id: 'desc',
          },
          take: 50,
          skip: messagesNextToken ? 1 : 0,
          cursor: messagesNextToken
            ? {
                id: messagesNextToken,
              }
            : undefined,
        },
      },
    });

    if (chat == null) {
      throw new Error('NO CHAT FOUND');
    }

    chat.messages.reverse();

    return {
      chat,
      messagesNextToken:
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].id
          : undefined,
    };
  }

  public async createChat(
    userId: string,
    initialMessages: Array<{
      message: string;
      messageType: ChatMessageType;
    }>,
  ): Promise<Chat & { messages: ChatMessage[] }> {
    const chat = await prisma.chat.create({
      data: {
        id: ulid(),
        userId,
        title:
          initialMessages.find((m) => m.messageType === 'USER')?.message || '',
        createdAt: DateTime.now().toJSDate(),
        messages: {
          create: initialMessages.map((m) => ({
            message: m.message,
            messageType: m.messageType,
            messageStatus: ChatMessageStatus.SENT,
          })),
        },
      },
      include: {
        messages: true,
      },
    });

    return chat;
  }

  public async *createChatMessage(
    userId: string,
    message: string,
    chatId?: string,
  ): AsyncGenerator<ChatMessage> {
    const usage = await this._userService.getUsage(userId);
    const limits = this._userService.getGptLimits();

    let model;

    if (
      usage.gptFourCalls === limits.gptFour &&
      usage.gptThreeDotFiveCalls === limits.gptThreeDotFive
    ) {
      throw new Error('USAGE LIMIT REACHED');
    } else if (usage.gptFourCalls === limits.gptFour) {
      model = 'gpt-3.5-turbo';
    } else {
      model = 'gpt-4';
    }

    let userMessage: ChatMessage;
    if (chatId) {
      userMessage = await prisma.chatMessage.create({
        data: {
          chatId,
          message,
          messageType: ChatMessageType.USER,
          messageStatus: ChatMessageStatus.SENT,
        },
      });
    } else {
      userMessage = {
        id: 1,
        chatId: 'NOCHAT',
        message,
        messageType: ChatMessageType.USER,
        messageStatus: ChatMessageStatus.SENT,
      };
    }
    yield userMessage;

    const openaiClient = this._aiService.getOpenAIClient();

    const resp = await openaiClient.chat.completions.create({
      model,
      stream: true,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    await this._userService.incrementUsage(
      userId,
      model === 'gpt-4' ? 'gpt4' : 'gpt3.5',
    );

    let aiMessageId = 2;
    if (chatId) {
      const message = await prisma.chatMessage.create({
        data: {
          chatId,
          message: '',
          messageType: ChatMessageType.AI,
          messageStatus: ChatMessageStatus.GENERATING,
        },
      });
      aiMessageId = message.id;
    }

    let fullMessage = '';

    for await (const chunk of resp) {
      const aiResponse = chunk.choices[0]?.delta?.content || '';
      if (aiResponse === '') continue;

      const aiResp: ChatMessage = {
        id: aiMessageId,
        chatId: 'NOCHAT',
        messageStatus: ChatMessageStatus.GENERATING,
        messageType: ChatMessageType.AI,
        message: aiResponse,
      };
      fullMessage += aiResponse;

      yield aiResp;
    }

    if (chatId) {
      await prisma.chatMessage.update({
        where: {
          id: aiMessageId,
        },
        data: {
          message: fullMessage,
          messageStatus: ChatMessageStatus.SENT,
        },
      });
    }
  }
}
