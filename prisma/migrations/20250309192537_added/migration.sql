/*
  Warnings:

  - The primary key for the `Row` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rowNumber` on the `Stitch` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - The required column `rowId` was added to the `Row` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `rowId` to the `Stitch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stitch" DROP CONSTRAINT "Stitch_rowNumber_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Row" DROP CONSTRAINT "Row_pkey",
ADD COLUMN     "rowId" TEXT NOT NULL,
ALTER COLUMN "number" DROP DEFAULT,
ADD CONSTRAINT "Row_pkey" PRIMARY KEY ("rowId");
DROP SEQUENCE "Row_number_seq";

-- AlterTable
ALTER TABLE "Stitch" DROP COLUMN "rowNumber",
ADD COLUMN     "rowId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "email" TEXT,
    "givenName" TEXT,
    "familyName" TEXT,
    "email_verified" BOOLEAN,
    "stripeId" TEXT,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "yahooId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicLink" (
    "token_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_email_idx" ON "users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_givenName_familyName_key" ON "users"("email", "givenName", "familyName");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLink_token_hash_key" ON "MagicLink"("token_hash");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stitch" ADD CONSTRAINT "Stitch_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "Row"("rowId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_user_id_email_fkey" FOREIGN KEY ("user_id", "email") REFERENCES "users"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
