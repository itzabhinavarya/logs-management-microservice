-- AlterTable
ALTER TABLE `project` ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false;
