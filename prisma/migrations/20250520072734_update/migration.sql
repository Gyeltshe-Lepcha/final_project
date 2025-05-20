/*
  Warnings:

  - Added the required column `currency` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "currency" TEXT NOT NULL;
