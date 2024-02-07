'use client';

import React, { useState } from 'react';

import { type ChatMessage } from '@colinzhao/prisma';
import { streamAiResponse } from '~/app/actions/streamAiResponse';
import { iterateStreamResponse } from '@colinzhao/utils';
import MessagesArea from '~/components/chat/MessagesArea';
import AIInputBox from '~/components/chat/AIInputBox';
import ChatArea from '~/components/chat/ChatArea';
import createChat from '~/app/actions/createChat';

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = async (value: string) => {
    let newMessages = [...messages];

    const stream = iterateStreamResponse(streamAiResponse(value));
    for await (const chunk of stream) {
      newMessages = [...newMessages];

      const messageToEditIdx = newMessages.findIndex((m) => m.id === chunk.id);
      if (messageToEditIdx !== -1) {
        newMessages[messageToEditIdx].message += chunk.message;
      } else {
        newMessages.push(chunk);
      }
      setMessages(newMessages);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <ChatArea
        initialMessages={[]}
        streamAiResponse={streamAiResponse}
        createChat={createChat}
      />
      {/*<MessagesArea messages={messages} />*/}
      {/*<AIInputBox handleSubmit={handleSubmit} />*/}
    </main>
  );
}
