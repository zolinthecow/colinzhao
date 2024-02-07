import { Chat, ChatMessageType, ChatMessage } from '@colinzhao/prisma';

export default interface IChatService {
  listUserChats(
    userId: string,
    nextToken?: string,
  ): Promise<{
    chats: Chat[];
    nextToken: string | undefined;
  }>;
  getChat(
    chatId: string,
    messagesNextToken?: number,
  ): Promise<{
    chat: Chat & { messages: ChatMessage[] };
    messagesNextToken: number | undefined;
  }>;
  createChat(
    userId: string,
    initialMessages: Array<{
      message: string;
      messageType: ChatMessageType;
    }>,
  ): Promise<Chat & { messages: ChatMessage[] }>;
  createChatMessage(
    userId: string,
    message: string,
    chatId?: string,
  ): AsyncGenerator<ChatMessage>;
  // createChatMessage(
  //   userId: string,
  //   message: string,
  //   chatId?: string,
  // ): Promise<ReturnType<typeof streamResponse>>;
}
