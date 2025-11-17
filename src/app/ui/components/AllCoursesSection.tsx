"use client";

import { Course } from "@/app/models/course";
import { CoursePackage } from "@/app/models/course-package";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { CourseCard } from "./CourseCard";
import { PackageCard } from "./PackageCard";

interface Props {
  coursePackages: CoursePackage[];
  courses: Course[];
  enrolled: any;
}

export const AllCoursesSection: React.FC<Props> = ({
  coursePackages,
  courses,
  enrolled,
}) => {
  const sortedCourses = courses.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const sortedPackages = coursePackages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 relative bg-white/60 backdrop-blur-sm border border-[#d0e7ff] rounded-3xl shadow-lg transition-all duration-300 flex flex-col justify-between p-10 z-10 overflow-hidden mx-10 sm:mx-4 sm:p-4"
      id="all-courses"
    >
      {/* Decorative circles */}
      <div className="absolute top-[5rem] left-0 w-44 h-44 bg-gradient-to-br from-[#00A6F4]/90 to-[#3b82f6]/70 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute top-[12rem] right-[200px] w-44 h-44 bg-gradient-to-br from-[#00A6F4]/90 to-[#3b82f6]/70 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-2 w-44 h-44 bg-gradient-to-br from-orange-400/70 to-orange-300/60 rounded-full blur-3xl animate-pulse z-0" />

      {/* Header and link */}
      <div className="flex items-center justify-between z-10">
        <h1 className="text-4xl sm:text-2xl mb-0 font-extrabold text-[#000] drop-shadow-sm leading-tight">
          Alle Kurse
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end relative z-10"
        >
          <Link
            href="/my-courses"
            className="inline-flex items-center gap-2 px-5 py-2 sm:px-3 sm:py-1 bg-white/40 backdrop-blur-sm rounded-full text-sm font-medium text-[#000] border border-[#d0e7ff] shadow hover:bg-white/60 hover:shadow-md transition cursor-pointer hover:scale-105 animate-fadeInGlow"
          >
            Meine Kurse anzeigen <HiArrowRight className="text-[#00A6F4]" />
          </Link>
        </motion.div>
      </div>

      {/* Courses list */}
      <div className="flex gap-8 sm:gap-6 justify-center flex-wrap mt-4">
        {sortedPackages.map((coursePackage) =>
          !enrolled.packages.find(
            (e) => e.coursePackageId === coursePackage.id
          ) ? (
            <PackageCard key={coursePackage.id} coursePackage={coursePackage} />
          ) : null
        )}
        {sortedCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={
              enrolled.courses.some((c) => c.course.id === course.id) ||
              enrolled.packages.find((p) => p.courseId === course.id)
            }
          />
        ))}
      </div>
    </motion.div>
  );
};
