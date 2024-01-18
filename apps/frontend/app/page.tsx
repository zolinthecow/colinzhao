import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import React from "react";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }
  redirect('/c/abcd')
  
  return (
    <div>
      {children}
    </div>
  )
}
