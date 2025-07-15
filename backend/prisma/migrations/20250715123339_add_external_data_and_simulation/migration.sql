/*
  Warnings:

  - You are about to drop the column `date` on the `simulation` table. All the data in the column will be lost.
  - You are about to drop the column `params` on the `simulation` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `simulation` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impact` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parameters` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `riskscore` ADD COLUMN `externalFactors` VARCHAR(191) NULL,
    ADD COLUMN `sectorFactor` DOUBLE NULL,
    ADD COLUMN `weatherFactor` DOUBLE NULL;

-- AlterTable
ALTER TABLE `simulation` DROP COLUMN `date`,
    DROP COLUMN `params`,
    DROP COLUMN `result`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `eventType` VARCHAR(191) NOT NULL,
    ADD COLUMN `impact` DOUBLE NOT NULL,
    ADD COLUMN `parameters` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ExternalData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
