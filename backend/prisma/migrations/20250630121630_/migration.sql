/*
  Warnings:

  - Added the required column `length` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` ADD COLUMN `length` INTEGER NOT NULL,
    MODIFY `endDate` DATETIME(3) NULL;
