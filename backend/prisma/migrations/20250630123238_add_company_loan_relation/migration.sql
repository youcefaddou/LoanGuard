/*
  Warnings:

  - You are about to drop the column `endDate` on the `loan` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `loan` table. All the data in the column will be lost.
  - Added the required column `sector` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyPayment` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskLevel` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `sector` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `loan` DROP COLUMN `endDate`,
    DROP COLUMN `length`,
    ADD COLUMN `companyId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `monthlyPayment` DOUBLE NOT NULL,
    ADD COLUMN `riskLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Actif';

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
