/*
  Warnings:

  - You are about to drop the column `moduleId` on the `UserModuleResult` table. All the data in the column will be lost.
  - You are about to drop the column `textType` on the `UserModuleResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserModuleResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserModuleResult" DROP CONSTRAINT "UserModuleResult_moduleId_fkey";

-- DropIndex
DROP INDEX "UserModuleResult_userId_moduleId_key";

-- AlterTable
ALTER TABLE "UserModuleResult" DROP COLUMN "moduleId",
DROP COLUMN "textType",
ADD COLUMN     "courseId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "UserModuleResult_userId_key" ON "UserModuleResult"("userId");
