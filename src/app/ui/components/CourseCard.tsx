import { COURSE_CONFIG } from "@/app/course-config";
import { formatPrice } from "@/app/helpers";
import { Course } from "@/app/models/course";
import { getCourseTypeResults } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import BuyCourseButton from "./BuyCourseButton";
import { CourseImage } from "./CourseImage";

export const CourseCard = ({
  course,
  isEnrolled,
}: {
  course: Course;
  isEnrolled: boolean;
}) => {
  const [precentageCompleted, setPrecentageCompleted] = useState(0);
  const [loadingPercentage, setLoadingPercentage] = useState(true);
  const precentageRoundend = Math.floor(precentageCompleted);
  useEffect(() => {
    if (!isEnrolled) return;
    (async () => {
      try {
        const results = await getCourseTypeResults(course.id);
        const history = results.map((r) => r.evaluation.history).flat();
        const itemsToBeCompleted = COURSE_CONFIG.tasksPerRound + 1; // +1 for video

        setPrecentageCompleted(
          (history.length / (COURSE_CONFIG.rounds * itemsToBeCompleted)) * 100
        );
      } catch (error) {
        console.error("Error fetching course type results:", error);
      } finally {
        setLoadingPercentage(false);
      }
    })();
  }, [isEnrolled]);

  return (
    <motion.div className="course-card">
      {/* IMAGE */}
      <div className="course-card-image-wrapper">
        {isEnrolled && !loadingPercentage && (
          <div className="absolute top-0 right-0 bg-white/90 text-orange-500 text-lg font-bold px-2 py-1 rounded-2xl z-50 animate-fadeInGlow">
            <span>{precentageRoundend}% erledigt</span>
          </div>
        )}
        <CourseImage imageUrl={course.mediaUrl} />
      </div>
      {!isEnrolled && course.discount !== undefined && course.discount > 0 && (
        <div className="absolute top-3 left-3 bg-[#00A6F4]/80 text-white text-sm font-bold px-2 py-1 rounded-full z-50">
          <span>-{course.discount}%</span>
        </div>
      )}
      {/* CONTENT */}
      <div className="p-3 flex-1 sm:p-1 relative z-10 flex flex-col">
        <div className="flex items-center justify-betweens">
          {/* <div className="flex flex-col"> */}
          <h2 className="text-lg mb-2 font-extrabold text-[#003366] truncate">
            {course.title}
          </h2>
          {/* <span className="max-w-[300px]">{course.description}</span> */}
        </div>
        {/* {!isEnrolled && (
            <span className="bg-gradient-to-r  animate-bounce  from-blue-400 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
              {"Kurs kaufen"}
            </span>
          )} */}
        {/* </div> */}

        {isEnrolled ? (
          <Link
            href={`/course-game/${course.id}`}
            className="bold-button mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold !rounded-full shadow transition whitespace-nowrap border border-orange-500"
          >
            Weiterlernen →
          </Link>
        ) : (
          <div>
            <h2 className="course-price">{formatPrice(course.price)}</h2>
            <BuyCourseButton course={course} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
