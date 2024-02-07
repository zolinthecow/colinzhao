'use server';

import { getSession } from '@auth0/nextjs-auth0';

import serviceCollection from '@colinzhao/services';
import { ChatMessageType } from '@colinzhao/prisma';

type InitialMessage = {
  message: string;
  messageType: ChatMessageType;
};

export default async function createChat(initialMessages: InitialMessage[]) {
  const session = await getSession();
  if (!session) {
    console.error('UNAUTHENTICATED');
    return;
  }
  const chat = await serviceCollection.chatService.createChat(
    session.user.sub,
    initialMessages,
  );
  return chat.id;
}
