/*
  Warnings:

  - You are about to drop the column `companyId` on the `bank` table. All the data in the column will be lost.
  - Added the required column `bankId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bank` DROP FOREIGN KEY `Bank_companyId_fkey`;

-- DropIndex
DROP INDEX `Bank_companyId_fkey` ON `bank`;

-- AlterTable
ALTER TABLE `bank` DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `company` ADD COLUMN `bankId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
