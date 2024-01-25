import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Provider from '@colinzhao/trpc/client/Provider';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Provider>{children}</Provider>
        </UserProvider>
      </body>
    </html>
  );
}