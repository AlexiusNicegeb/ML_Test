"use client";

import { fetchEnrolled, getAllCourses } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { averageHistoryPerEntry } from "@/lib/helpers";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUserAuth } from "../context/user/UserAuthContext";
import withProtectedUserPage from "../context/user/withProtectedUserPage";
import { Course } from "../models/course";

function ResultPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<number>();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [entries, setEntries] = useState<any>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const { user } = useUserAuth();

  const chartData = entries.map((item, i) => {
    if (selectedCourseId !== item?.courseId) {
      return null;
    }

    return {
      name: `Text ${i + 1}`,
      score: item.score,
    };
  });

  useEffect(() => {
    Promise.all([getAllCourses(), fetchEnrolled()]).then(
      ([coursesData, enrolledData]) => {
        setSelectedCourseId(coursesData[0]?.id);
        setCourses(coursesData);
        setMyCourses(
          coursesData.filter(
            (c) =>
              enrolledData.courses.find((e) => e.course.id === c.id) !==
              undefined
          )
        );
      }
    );
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/attempt?userId=${userId || user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Error fetching results");
        const formatted = data.map((item: any) => ({
          id: item.id,
          score: item.evaluation?.history?.[0]?.total ?? 0,
          ...item,
        }));
        setEntries(formatted);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [userId, user.id]);

  entries.filter((e) => e.courseId === selectedCourseId);
  const average = averageHistoryPerEntry(
    entries.filter((e) => e?.courseId === selectedCourseId)
  );
  return (
    <div className="pt-10 w-[98%] max-w-7xl">
      {isLoading || !user ? (
        <motion.div
          className="mt-20 flex justify-center items-center w-full h-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </motion.div>
      ) : entries.length < 1 ? (
        <motion.div
          className="flex flex-col items-center justify-center mt-12 bg-white/60 backdrop-blur-md border border-[#d0e7ff] rounded-3xl shadow-md p-8 sm:p-6 text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <img
            src="/robot3.png"
            alt="Keine Ergebnisse"
            className="w-[200px] object-cover mb-0"
          />
          <h3 className="text-xl font-semibold  mb-3">Noch keine Ergebnisse</h3>
          <p className="text-blue-800 text-base mb-6">
            Du hast bisher noch keine Texte eingereicht. Starte jetzt und
            erhalte dein erstes Feedback!
          </p>
          {courses && courses.length > 0 && (
            <>
              {myCourses.length > 0 ? (
                <button
                  onClick={() => router.push(`/course-game/${myCourses[0].id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-all"
                >
                  Kurs starten
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-all"
                >
                  Kurs kaufen
                </button>
              )}
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="z-20 w-full max-w-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Textsorten Selector */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 bg-white/40 backdrop-blur-md border border-[#d0e7ff] rounded-2xl px-6 py-4 sm:px-3 sm:py-2 shadow-md mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`px-5 py-2 sm:px-3 sm:py-1 rounded-full text-sm font-medium transition border ${
                  selectedCourseId === course.id
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                }`}
              >
                {course.title}
              </button>
            ))}
          </motion.div>

          {/* Score Boxes */}
          <motion.div
            className="flex justify-center items-center flex-wrap gap-4 sm:gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.2 },
              },
            }}
          >
            {average.map((entry) => (
              <motion.button
                key={entry.id}
                onClick={() => {
                  router.push(`/result/${entry.courseId}?round=${entry.round}`);
                }}
                className="bg-white/60 backdrop-blur-md border border-[#d0e7ff] rounded-xl shadow-md hover:shadow-xl hover:scale-105 hover:border-orange-400 transition px-6 py-5 sm:px-3 sm:py-3 sm:text-base text-center text-blue-800 text-xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {entry.score}%
              </motion.button>
            ))}
          </motion.div>

          {/* Graph */}
          {entries.length >= 1 && (
            <motion.div
              className="bg-white/50 backdrop-blur-md border border-[#d0e7ff] rounded-3xl shadow-md p-6 mt-10 sm:mt-5 sm:p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-base font-semibold text-blue-800 mb-6">
                Lernkurve
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#4b5563" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default withProtectedUserPage(ResultPage);
