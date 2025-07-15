/*
  Warnings:

  - You are about to drop the column `riskLevel` on the `loan` table. All the data in the column will be lost.
  - Added the required column `riskLevel` to the `RiskScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` DROP COLUMN `riskLevel`;

-- AlterTable
ALTER TABLE `riskscore` ADD COLUMN `riskLevel` VARCHAR(191) NOT NULL;
