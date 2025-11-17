/*
  Warnings:

  - You are about to drop the `user_task_attempts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_task_attempts" DROP CONSTRAINT "user_task_attempts_taskId_fkey";

-- DropForeignKey
ALTER TABLE "user_task_attempts" DROP CONSTRAINT "user_task_attempts_userId_fkey";

-- DropTable
DROP TABLE "user_task_attempts";
