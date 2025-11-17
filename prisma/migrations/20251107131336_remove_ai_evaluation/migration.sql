/*
  Warnings:

  - You are about to drop the `ai_evaluations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_evaluations" DROP CONSTRAINT "ai_evaluations_attemptId_fkey";

-- DropTable
DROP TABLE "ai_evaluations";
