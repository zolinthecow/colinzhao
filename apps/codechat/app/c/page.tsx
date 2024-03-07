'use client';

import React, { useState } from 'react';

import { type ChatMessage } from '@colinzhao/prisma';
import { streamAiResponse } from '~/actions/streamAiResponse';
import { iterateStreamResponse } from '@colinzhao/lib/NextStreamingHelpers';
import MessagesArea from '~/components/chat/MessagesArea';
import AIInputBox from '~/components/chat/AIInputBox';
import ChatArea from '~/components/chat/ChatArea';
import createChat from '~/actions/createChat';

export default function Page() {
  return (
    <ChatArea
      initialMessages={[]}
      streamAiResponse={streamAiResponse}
      createChat={createChat}
    />
  );
}
