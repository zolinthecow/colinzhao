'use server';

import { getSession } from '@auth0/nextjs-auth0';

import { ChatMessageType } from '@colinzhao/prisma';

import ChatService from '~/services/ChatService';

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
  const chat = await ChatService.createChat(session.user.sub, initialMessages);
  return chat.id;
}
