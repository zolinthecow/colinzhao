import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';
import { redirect } from 'next/navigation';
import { Chat } from '@colinzhao/prisma';
import { DateTime } from 'luxon';

import ChatService from '~/services/ChatService';

type ChatSectionKeys =
  | 'Today'
  | 'Yesterday'
  | 'Previous 7 Days'
  | 'Previous 30 Days'
  | 'All Time';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  const chats = await ChatService.listUserChats(session.user.sub);
  const chatSections: {
    [key in ChatSectionKeys]: Chat[];
  } = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    'All Time': [],
  };
  chats.chats.forEach((chat) => {
    const chatCreatedAt = DateTime.fromJSDate(chat.createdAt);
    const now = DateTime.now();
    if (now.diff(chatCreatedAt, 'days').toObject().days === 0) {
      chatSections.Today.push(chat);
    } else if (now.diff(chatCreatedAt, 'days').toObject().days === 1) {
      chatSections.Yesterday.push(chat);
    } else if ((now.diff(chatCreatedAt, 'days').toObject().days ?? 0) <= 7) {
      chatSections['Previous 7 Days'].push(chat);
    } else if ((now.diff(chatCreatedAt, 'days').toObject().days ?? 0) <= 30) {
      chatSections['Previous 30 Days'].push(chat);
    } else {
      chatSections['All Time'].push(chat);
    }
  });

  return (
    <main className="flex min-h-screen flex-row bg-background">
      <div
        className={'flex h-screen w-64 overflow-scroll flex-col bg-black p-6'}
      >
        <h1 className={'text-lg font-semibold text-foreground'}>Code Chat</h1>
        {Object.entries(chatSections)
          .filter(([key, val]) => val.length > 0)
          .map(([label, chats]) => (
            <div key={label} className={'pb-2'}>
              <span
                className={
                  'text-sm font-medium text-input.placeholderForeground'
                }
              >
                {label}
              </span>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={'p-1 overflow-ellipsis text-foreground text-base'}
                >
                  {chat.title}
                </div>
              ))}
            </div>
          ))}
      </div>
      <div className={'flex flex-1 flex-col items-center h-full pr-24'}>
        {children}
      </div>
    </main>
  );
}
