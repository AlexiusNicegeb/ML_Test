"use client";

import { fetchEnrolled, getAllCourses } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TOAST_DEFAULT_CONFIG, TOAST_DEFAULT_MESSAGE } from "../constants";
import withProtectedUserPage from "../context/user/withProtectedUserPage";
import { Course } from "../models/course";
import { ArrowLeft } from "../ui/assets/icons/ArrowLeft";
import { CourseCard } from "../ui/components/CourseCard";
import { LoadingSpinner } from "../ui/components/LoadingSpinner";

function MyCourses() {
  const [loadingCourses, setLoadingCourses] = useState(true);
  const router = useRouter();
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  const handleGoBack = () => {
    router.back();
  };

  const circleColors = [
    { top: "bg-[#00A6F4]/70", bottom: "bg-orange-400/90" },
    { top: "bg-[#8b5cf6]/70", bottom: "bg-pink-500/90" },
    { top: "bg-[#10b981]/70", bottom: "bg-yellow-400/90" },
    { top: "bg-[#ec4899]/70", bottom: "bg-[#3b82f6]/90" },
    { top: "bg-[#f97316]/70", bottom: "bg-[#a855f7]/90" },
  ];

  useEffect(() => {
    Promise.all([getAllCourses(), fetchEnrolled()])
      .then(([coursesData, enrolledData]) => {
        setMyCourses(
          coursesData.filter(
            (c) =>
              enrolledData.courses.find((e) => e.course.id === c.id) !==
                undefined ||
              enrolledData.packages.find((p) => p.courseId === c.id) !==
                undefined
          )
        );
        setLoadingCourses(false);
      })
      .catch((err: any) => {
        toast.error(TOAST_DEFAULT_MESSAGE, TOAST_DEFAULT_CONFIG);
        setLoadingCourses(false);
      });
  }, []);

  if (loadingCourses) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="mx-4 w-[98%] max-w-7xl mt-6">
        <div className="flex mb-8 items-center justify-between w-full px-4 py-3 sm:py-1 sm:px-2 rounded-3xl bg-white/60 backdrop-blur-sm shadow-md border border-[#d0e7ff] hover:shadow-lg transition-all duration-300 relative z-10">
          <div className="flex items-center gap-2">
            <div
              onClick={handleGoBack}
              className="bg-white rounded-full p-2 shadow-md border border-[#d0e7ff] cursor-pointer hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-6 h-6" fill="#00A6F4" />
            </div>
            <h1 className="text-2xl sm:text-xl font-extrabold text-[#000] drop-shadow-sm relative z-10 !mb-0">
              Meine Kurse
            </h1>
          </div>
        </div>

        {myCourses.length > 0 ? (
          <div className="flex flex-wrap gap-8 relative z-10 justify-center ">
            {myCourses.map((course, index) => {
              const colorSet = circleColors[index % circleColors.length];

              // return (
              //   <motion.div
              //     key={course.id}
              //     initial={{ opacity: 0, y: 20 }}
              //     animate={{ opacity: 1, y: 0 }}
              //     className="max-w-[320px] w-full relative bg-white/60 backdrop-blur-sm border border-[#d0e7ff] rounded-3xl shadow-lg overflow-hidden flex flex-col"
              //   >
              //     {/* INNER DECORATIVE */}

              //     <div
              //       className={`absolute bottom-4 left-4 w-20 h-20 ${colorSet.bottom} rounded-full blur-2xl z-0`}
              //     ></div>

              //     {/* IMAGE */}
              //     <div className="relative h-48 overflow-hidden z-10 flex justify-center w-full p-2">
              //       <CourseImage className="w-full h-full object-cover" />
              //       <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
              //     </div>

              //     {/* CONTENT */}
              //     <div className="p-4 relative z-10 flex flex-1 flex-col justify-between gap-2">
              //       <div>
              //         <h2 className="text-lg font-bold text-[#000] truncate">
              //           {course.title}
              //         </h2>
              //         <p className="text-sm text-[#4b5563] leading-relaxed line-clamp-3">
              //           {course.description}
              //         </p>
              //       </div>

              //       <Link
              //         href={`/word-game`}
              //         className="bold-button inline-flex items-center justify-center gap-2 !px-6 !py-3 sm:!px-3 sm:!py-1 sm:!text-base mt-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold !rounded-full shadow hover:shadow-lg hover:scale-105 transition whitespace-nowrap border border-orange-500"
              //       >
              //         Weiterlernen
              //         <HiArrowRight />
              //       </Link>
              //     </div>
              //   </motion.div>
              // );

              return (
                <CourseCard key={course.id} course={course} isEnrolled={true} />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-[#4b5563] font-medium relative z-10">
            Keine Kurse gefunden
          </p>
        )}
      </div>
    </>
  );
}

export default withProtectedUserPage(MyCourses);
