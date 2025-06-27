/*
  Warnings:

  - You are about to alter the column `name` on the `company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `address` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `city` VARCHAR(100) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `zipCode` VARCHAR(5) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL;
