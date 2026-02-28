-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "PackItemStatus" AS ENUM ('pending', 'ingested', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pin" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "canonicalUrl" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "attributionText" TEXT,
    "userId" TEXT NOT NULL,
    "boardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuratedPack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuratedPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuratedPackItem" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "canonicalUrl" TEXT NOT NULL,
    "status" "PackItemStatus" NOT NULL DEFAULT 'pending',
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuratedPackItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pin_canonicalUrl_key" ON "Pin"("canonicalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "CuratedPack_slug_key" ON "CuratedPack"("slug");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuratedPackItem" ADD CONSTRAINT "CuratedPackItem_packId_fkey" FOREIGN KEY ("packId") REFERENCES "CuratedPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
