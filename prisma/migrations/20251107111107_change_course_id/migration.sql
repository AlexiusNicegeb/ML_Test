-- AlterTable
ALTER TABLE "UserModuleResult" ALTER COLUMN "courseId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "UserModuleResult" ADD CONSTRAINT "UserModuleResult_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
