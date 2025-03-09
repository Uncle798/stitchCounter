-- CreateEnum
CREATE TYPE "StitchType" AS ENUM ('Single', 'Increase');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Row" (
    "number" SERIAL NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Row_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Stitch" (
    "id" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "type" "StitchType" NOT NULL,

    CONSTRAINT "Stitch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- AddForeignKey
ALTER TABLE "Row" ADD CONSTRAINT "Row_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stitch" ADD CONSTRAINT "Stitch_rowNumber_fkey" FOREIGN KEY ("rowNumber") REFERENCES "Row"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
