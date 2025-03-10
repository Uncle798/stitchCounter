/*
  Warnings:

  - Added the required column `number` to the `Stitch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stitch" ADD COLUMN     "number" INTEGER NOT NULL;
