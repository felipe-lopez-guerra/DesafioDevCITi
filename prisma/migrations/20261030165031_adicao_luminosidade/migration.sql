/*
  Warnings:

  - Added the required column `luminosidade` to the `Planta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planta" ADD COLUMN     "luminosidade" "Luminosidade" NOT NULL;
