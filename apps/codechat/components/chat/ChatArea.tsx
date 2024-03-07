'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  type ChatMessage,
  ChatMessageType,
  ChatMessageStatus,
} from '@colinzhao/prisma';
import { streamAiResponse } from '~/actions/streamAiResponse';
import { iterateStreamResponse } from '@colinzhao/lib/NextStreamingHelpers';
import MessagesArea from '~/components/chat/MessagesArea';
import AIInputBox from '~/components/chat/AIInputBox';
import createChat from '~/actions/createChat';

type Props = {
  initialMessages: ChatMessage[];
  streamAiResponse: typeof streamAiResponse;
  createChat?: typeof createChat;
};

const initialChatMessage: ChatMessage = {
  id: 12378423487,
  chatId: 'TEMP',
  message: 'Hi! Ask me any coding question you want.',
  messageStatus: ChatMessageStatus.SENT,
  messageType: ChatMessageType.AI,
};

const ChatArea: React.FC<Props> = ({
  initialMessages,
  streamAiResponse,
  createChat,
}) => {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length > 0 ? initialMessages : [initialChatMessage],
  );

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

    if (createChat) {
      const newChatId = await createChat(
        newMessages.map((m) => ({
          message: m.message,
          messageType: m.messageType,
        })),
      );

      await router.replace(`/c/${newChatId}`);
    }
  };

  return (
    <div className="w-full max-w-4xl flex min-h-screen flex-col bg-red">
      <MessagesArea messages={messages} />
      <AIInputBox handleSubmit={handleSubmit} />
    </div>
  );
};

export default ChatArea;
