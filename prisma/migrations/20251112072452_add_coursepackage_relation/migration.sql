-- CreateTable
CREATE TABLE "course_packages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaUrl" TEXT NOT NULL,
    "slug" TEXT,
    "price" DECIMAL(10,2) DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_packages_courses" (
    "coursePackageId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "course_packages_courses_pkey" PRIMARY KEY ("coursePackageId","courseId")
);

-- AddForeignKey
ALTER TABLE "course_packages_courses" ADD CONSTRAINT "course_packages_courses_coursePackageId_fkey" FOREIGN KEY ("coursePackageId") REFERENCES "course_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_packages_courses" ADD CONSTRAINT "course_packages_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
