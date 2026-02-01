/*
  Warnings:

  - Added the required column `urlExpo` to the `public_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public_files" ADD COLUMN     "urlExpo" TEXT NOT NULL;
