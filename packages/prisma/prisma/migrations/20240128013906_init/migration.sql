-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('AI', 'USER');

-- CreateEnum
CREATE TYPE "ChatMessageStatus" AS ENUM ('SENT', 'INTERRUPTED', 'ERRORED', 'GENERATING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usage" (
    "userId" TEXT NOT NULL,
    "createdAt" TIME NOT NULL,
    "gptFourCalls" INTEGER NOT NULL,
    "gptThreeDotFiveCalls" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIME NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageType" "ChatMessageType" NOT NULL,
    "messageStatus" "ChatMessageStatus" NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usage_userId_key" ON "Usage"("userId");

-- CreateIndex
CREATE INDEX "usage_user_id_idx" ON "Usage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userId_key" ON "Chat"("userId");

-- CreateIndex
CREATE INDEX "chat_user_id_idx" ON "Chat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_chatId_key" ON "ChatMessage"("chatId");

-- CreateIndex
CREATE INDEX "chat_message_chat_id_idx" ON "ChatMessage"("chatId");

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
