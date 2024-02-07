'use server';

import { getSession } from '@auth0/nextjs-auth0';

import serviceCollection from '@colinzhao/services';
import { streamResponse } from '@colinzhao/utils';

export const streamAiResponse = streamResponse(async (content: string) => {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }
  return serviceCollection.chatService.createChatMessage(
    session.user.sub,
    content,
  );
});
