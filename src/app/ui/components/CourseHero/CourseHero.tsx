import { useRouter } from "next/navigation";
import { Breadcrumbs } from "../Breadcrumbs";
import { CourseImage } from "../CourseImage";
import { CourseMenu } from "./CourseMenu";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";

import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

const mockModules = [
  { title: "Modul 1: ", progress: 80 },
  { title: "Modul 2: ", progress: 55 },
  { title: "Modul 3: ", progress: 30 },
  { title: "Modul 4: ", progress: 0 },
];

export const CourseModulesPlaceholder = () => {
  const totalProgress =
    mockModules.reduce((acc, m) => acc + m.progress, 0) / mockModules.length;

  return (
    <div className="w-full flex flex-col justify-center items-center h-full gap-6">
      <h1 className="m-0 text-3xl sm:text-xl font-bold">Deine Fortschritte</h1>
      <div className="relative w-28 h-28 ">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="#e0e0e0"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="#4caf50"
            strokeWidth="10"
            strokeDasharray="188"
            strokeDashoffset={188 - (188 * totalProgress) / 100}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#4caf50]">
          {Math.round(totalProgress)}%
        </div>
      </div>

      <div className="flex gap-4 items-center sm:flex-col juctify-between">
        {mockModules.map((module, index) => (
          <Link
            href={`/word-game`}
            key={index}
            className="w-[160px] sm:w-[full]  bg-white/70 backdrop-blur border border-[#d0e7ff] rounded-xl shadow-md p-6 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#333]">
                {module.title}
              </h2>
              <span className="text-sm font-bold text-[#4caf50]">
                {module.progress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-[#4caf50] rounded-full transition-all duration-300"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

interface CourseHeroProps {
  courseId?: string;
  courseImage?: string;
  name?: string;
  description?: string;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const CourseHero = ({
  courseId,
  name,
  description,
  courseImage,
  activeSection,
  setActiveSection,
}: CourseHeroProps) => {
  return (
    <>
      <div className="relative flex md:flex-col md:justify-center gap-10 sm:gap-3 p-10 sm:p-6 bg-white/60 backdrop-blur-sm border border-[#d0e7ff] rounded-3xl shadow-lg transition-all duration-300 overflow-hidden z-10">
        {/* BACKGROUND DECORATIVE CIRCLES */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-[#00A6F4]/80 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-orange-400/30 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#00A6F4]/20 rounded-full blur-2xl animate-spin-slow z-0"></div>

        {/* LEFT BLOCK */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-3 z-10 relative items-start">
          {/* DECORATIVE BACKGROUND CIRCLES */}
          <div className="absolute bottom-20 right-40 w-24 h-24 bg-orange-400/80 rounded-full blur-3xl z-0 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#00A6F4]/60 rounded-full blur-2xl z-0 animate-spin-slow"></div>

          {/* IMAGE */}
          <div className="w-full max-w-sm  relative ">
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-[#d0e7ff] shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 transition relative z-10">
              <CourseImage imageUrl={courseImage} />
            </div>
          </div>

          {/* META */}
          <div className="flex flex-col gap-2 sm:gap-1 relative z-10">
            {/* BADGE */}
            <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full w-fit shadow-sm">
              KURS
            </span>

            {/* TITLE */}
            <h1 className="block  max-w-max overflow-hidden text-3xl sm:text-2xl font-extrabold text-[#000] drop-shadow-sm leading-tight">
              <span className="relative inline-block pb-1">
                {name}
                <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 animate-underlineLoop rounded-full"></span>
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-[#4b5563] text-sm leading-relaxed max-w-md mt-1 sm:-mt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="flex-1  relative flex flex-col items-center justify-center bg-white/50 backdrop-blur rounded-3xl shadow-lg border border-[#d0e7ff] p-8 gap-6 sm:p-4 sm:gap-3">
          {/* CIRCLES DECOR */}
          <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-[#00A6F4]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="flex items-center sm:flex-col gap-2 justify-center">
            {/* PROGRESS */}
            <CourseModulesPlaceholder />
          </div>
          {/* SEPARATOR */}
          <div className="w-36 h-[4px] bg-gradient-to-r from-[#ed9c76] to-transparent rounded-full mx-4"></div>

          {/* <Breadcrumbs
            courseId={courseId}
            courseName={activeSection}
            lectureName={name}
          /> */}
        </div>
      </div>
    </>
  );
};
