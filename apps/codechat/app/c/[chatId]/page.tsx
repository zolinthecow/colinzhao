'use server';

import React from 'react';

import { type ChatMessage } from '@colinzhao/prisma';
import serviceCollection from '@colinzhao/services';

import { streamAiResponse } from '~/app/actions/streamAiResponse';
import ChatArea from '~/components/chat/ChatArea';

type Props = {
  params: { chatId: string };
};

export default async function Page({ params }: Props) {
  const chatData = await serviceCollection.chatService.getChat(params.chatId);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <ChatArea
        initialMessages={chatData.chat.messages}
        streamAiResponse={streamAiResponse}
      />
    </main>
  );
}
