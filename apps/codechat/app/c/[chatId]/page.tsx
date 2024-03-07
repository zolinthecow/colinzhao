'use server';

import React from 'react';

import ChatService from '~/services/ChatService';
import { streamAiResponse } from '~/actions/streamAiResponse';
import ChatArea from '~/components/chat/ChatArea';

type Props = {
  params: { chatId: string };
};

export default async function Page({ params }: Props) {
  const chatData = await ChatService.getChat(params.chatId);

  return (
    <ChatArea
      initialMessages={chatData.chat.messages}
      streamAiResponse={streamAiResponse}
    />
  );
}
