/*
  Warnings:

  - You are about to drop the column `moduleId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[position]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_moduleId_fkey";

-- DropIndex
DROP INDEX "tasks_moduleId_idx";

-- DropIndex
DROP INDEX "tasks_moduleId_position_key";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "moduleId";

-- DropTable
DROP TABLE "modules";

-- CreateIndex
CREATE UNIQUE INDEX "tasks_position_key" ON "tasks"("position");
