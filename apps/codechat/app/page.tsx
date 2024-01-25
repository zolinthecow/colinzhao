import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }
  redirect('/c/abcd');

  return <div>{children}</div>;
}
