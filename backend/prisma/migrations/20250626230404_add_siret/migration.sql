/*
  Warnings:

  - A unique constraint covering the columns `[siret]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `siret` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `siret` VARCHAR(14) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_siret_key` ON `Company`(`siret`);
