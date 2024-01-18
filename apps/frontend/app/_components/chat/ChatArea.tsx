'use client';

import { useState, useEffect } from 'react';

import AITextBubble from './AITextBubble';
import UserTextBubble from './UserTextBubble';

export type Message = {
  type: 'AI' | 'USER';
  id: string;
  order: number;
  message: string;
};

type Props = {
  messages: Message[];
};

const ChatArea: React.FC<Props> = ({ messages }) => {
  return (
    <div className="max-w-5xl w-full min-h-screen flex-col font-mono text-sm lg:flex pt-3 pb-32">
      <AITextBubble text="Hi! Ask me any coding question you want :)" />
      {messages.map(m => {
        if (m.type === 'AI') {
          return <AITextBubble key={m.id} text={m.message} />;
        } else {
          return <UserTextBubble key={m.id} text={m.message} />;
        }
      })}
    </div>
  )
};

export default ChatArea;
