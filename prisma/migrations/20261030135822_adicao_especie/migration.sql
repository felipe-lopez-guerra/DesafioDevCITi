/*
  Warnings:

  - Added the required column `especie` to the `Planta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planta" ADD COLUMN     "especie" TEXT NOT NULL;
