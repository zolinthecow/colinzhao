'use client';

import { useState, useEffect } from 'react';

import { ChatMessage, ChatMessageType } from '@colinzhao/prisma';
import AITextBubble from './AITextBubble';
import UserTextBubble from './UserTextBubble';

type Props = {
  messages: ChatMessage[];
};

const MessagesArea: React.FC<Props> = ({ messages }) => {
  return (
    <div className="max-w-5xl w-full min-h-screen flex-col font-mono text-sm lg:flex pt-3 pb-32">
      {messages.map((m) => {
        if (m.messageType === ChatMessageType.AI) {
          return <AITextBubble key={m.id} text={m.message} />;
        } else {
          return <UserTextBubble key={m.id} text={m.message} />;
        }
      })}
    </div>
  );
};

export default MessagesArea;
