/*
  Warnings:

  - The `courseId` column on the `UserModuleResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,courseId,round]` on the table `UserModuleResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserModuleResult_userId_key";

-- AlterTable
ALTER TABLE "UserModuleResult" DROP COLUMN "courseId",
ADD COLUMN     "courseId" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "UserModuleResult_userId_courseId_round_key" ON "UserModuleResult"("userId", "courseId", "round");
