import { useUserAuth } from "@/app/context/user/UserAuthContext";
import { Course } from "@/app/models/course";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export const HeroHome = ({ lastCourse }: { lastCourse: Course }) => {
  const { user } = useUserAuth();

  return (
    <div className="flex w-full md:flex-col gap-10 relative px-10 sm:px-4">
      {/* LEFT PANEL */}
      <motion.div
        id="start-new-course"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 relative bg-white/60 backdrop-blur-sm border border-[#d0e7ff] rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-10 z-10 overflow-hidden sm:p-4"
      >
        {/* BACKGROUND CIRCLES */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-[#00A6F4]/90 rounded-full blur-3xl animate-pulse z-10"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-orange-400/20 rounded-full blur-3xl animate-pulse z-10"></div>
        <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-[#00A6F4]/30 rounded-full blur-2xl animate-spin-slow z-10"></div>

        <motion.div
          // initial={{ opacity: 0, x: -20 }}
          // animate={{ opacity: 1, x: 0 }}
          // transition={{ delay: 0.2 }}
          className="flex items-center gap-4 sm:gap-2 relative z-10"
        >
          <div className="w-20 h-20 sm:w-18 flex-shrink-0 sm:h-16 sm:w-16 rounded-full bg-white text-[#00A6F4] font-bold flex items-center justify-center text-3xl shadow-md border border-[#d0e7ff] animate-fadeInGlow">
            {user ? user.firstName?.[0] : "?"}
          </div>
          <div>
            <h1 className="text-4xl sm:text-xl font-extrabold text-[#000] drop-shadow-sm leading-tight sm:mb-0">
              Willkommen zurück, {user ? user.firstName : "Unternehmer"}
            </h1>
            <p className="text-sm text-[#555] mt-1">
              Hier findest du alle Kurse, die du bereits gekauft hast.
            </p>
          </div>
        </motion.div>

        {/* <StartCourse /> */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-50 mt-6"
        >
          <Link
            href="/my-courses"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-3 sm:py-1 bg-white/40 backdrop-blur-sm rounded-full text-sm font-medium text-[#000] border border-[#d0e7ff] shadow hover:bg-white/60 hover:shadow-md hover:scale-105 transition cursor-pointer animate-fadeInGlow z-50 "
          >
            Alle Kurse anzeigen
            <HiArrowRight className="text-[#00A6F4]" />
          </Link>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 relative bg-white/50 backdrop-blur-sm border border-[#d0e7ff] rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden z-10"
      >
        {/* BACKGROUND DECORATIVE CIRCLES */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-orange-400/30 rounded-full blur-2xl animate-pulse z-10"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-orange-400/20 rounded-full blur-3xl animate-pulse z-50"></div>
        <div className="relative h-64 sm:h-40 overflow-hidden">
          <img
            src={"/test-image.webp"}
            alt="Course"
            className="object-cover w-full h-full opacity-80 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-radial from-white/60 to-transparent"></div>

          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs text-[#00A6F4] border border-[#d0e7ff] shadow animate-fadeInGlow z-20">
            Letzte Lektion
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`/course-game/${lastCourse.id}`}
            className="absolute bottom-4 left-4 bg-white/80 backdrop-blur text-[#00A6F4] font-bold px-6 py-2 sm:px-3 sm:py-1 rounded-full shadow border border-[#d0e7ff] hover:bg-white hover:shadow-lg"
          >
            Weiterlernen →
          </motion.a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 relative z-10 sm:p-4"
        >
          <h2 className="text-2xl font-bold text-orange-500">
            {lastCourse.title}
          </h2>
          <p className="text-[#4b5563] mt-1 text-sm leading-relaxed">
            {lastCourse.description}
          </p>
          {/* <div className="flex items-center gap-2 text-[#4b5563] text-xs mt-2">
            <HiClock size={20} className="text-[#00A6F4]" />
            <span className="font-bold text-base">1h30min</span>
          </div> */}
        </motion.div>
      </motion.div>
    </div>
  );
};
