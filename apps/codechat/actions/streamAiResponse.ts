'use server';

import { getSession } from '@auth0/nextjs-auth0';

import { streamResponse } from '@colinzhao/lib/NextStreamingHelpers';

import ChatService from '~/services/ChatService';

export const streamAiResponse = streamResponse(async (content: string) => {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }
  return ChatService.createChatMessage(session.user.sub, content);
});
