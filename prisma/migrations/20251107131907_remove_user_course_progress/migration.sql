/*
  Warnings:

  - You are about to drop the `user_course_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_course_progress" DROP CONSTRAINT "user_course_progress_courseId_fkey";

-- DropForeignKey
ALTER TABLE "user_course_progress" DROP CONSTRAINT "user_course_progress_userId_fkey";

-- DropTable
DROP TABLE "user_course_progress";
