'use client';

import Image from 'next/image'
import serviceCollection from '../services/loadServices'
import AIInputBox from './_components/page/AIInputBox'
import AITextBubble from './_components/page/AITextBubble';
import UserTextBubble from './_components/page/UserTextBubble';
import { trpc } from '~/utils/trpc';
import ChatArea, { Message } from './_components/page/ChatArea';
import { useState } from 'react';
import axios from 'axios';
import { RestTypes } from '@codechat/api-types';

type ChatResponseType = {
  type: 'AI' | 'USER';
  id: string;
  message: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (value: string) => {
    const stream = await serviceCollection.apiService.generateStream(
      'stream-chat-response',
      {
        body: {
          content: value,
        },
      },
      {
        method: 'POST',
      }
    );

    let newMessages = [...messages];

    for await (const chunk of stream) {
      newMessages = [...newMessages];

      chunk.forEach(c => {
        const messageToEditIdx = newMessages.findIndex(m => m.id === c.id);
        if (messageToEditIdx !== -1) {
          newMessages[messageToEditIdx].message += c.message;
        } else {
          newMessages.push({
            id: c.id,
            order: newMessages.length + 1,
            message: c.message,
            type: c.type,
          });
        }
      });
      setMessages(newMessages); 
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <ChatArea messages={messages} />
      <AIInputBox handleSubmit={handleSubmit} />
    </main>
  )
}
