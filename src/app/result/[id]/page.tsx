"use client";

import { CategoryBreakdown } from "@/app/components/ResultPage/CategoryBreakdown";
import { CategoryDonutGrid } from "@/app/components/ResultPage/CategoryDonutGrid";
import { ResultsHeader } from "@/app/components/ResultPage/ResultHeader";
import { useUserAuth } from "@/app/context/user/UserAuthContext";
import withProtectedUserPage from "@/app/context/user/withProtectedUserPage";
import { COURSE_TYPES } from "@/app/models/course-types";
import { ArrowLeft } from "@/app/ui/assets/icons/ArrowLeft";
import { getToken } from "@/lib/auth";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ResultsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const round = searchParams.get("round");
  const [entries, setEntries] = useState<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(
          `/api/attempt?courseId=${id}&userId=${userId || user.id}&round=${round}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error fetching results");

        const data = await res.json();
        if (data) {
          setEntries(data);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [userId, user.id]);

  const history = entries?.evaluation?.history?.[0];

  const categories = Object.entries(history?.breakdown || {}).map(
    ([key, value]: [string, any]) => ({
      title: key,
      score: value.points,
    })
  );

  const categoriesBySub = Object.entries(history?.sub || {}).map(
    ([key, subValues]: [string, Record<string, number>]) => ({
      title: key,
      score: history?.breakdown?.[key]?.points ?? 0,
      sub: Object.entries(subValues).map(([label, value]) => ({
        label,
        value,
      })),
    })
  );

  if (isLoading || !user) {
    return (
      <motion.div
        className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-[#bfdbfe] via-[#93c5fd] to-[#7dd3fc] "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </motion.div>
    );
  }

  if (!entries) {
    return (
      <div className="z-20 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/40 backdrop-blur-md border border-[#d0e7ff] rounded-3xl px-6 py-6 shadow-md w-full flex flex-col items-center justify-center text-center"
        >
          <div className="w-[220px] h-[180px] mb-6 animate-spin-slow">
            <img src="/robot.png" alt="Suchroboter" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 drop-shadow-sm">
            Oops! Der Text wurde nicht gefunden.
          </h1>
          <p className="text-md text-slate-700 max-w-xl mb-6">
            Der gewünschte Text existiert leider nicht oder wurde entfernt.
            Bitte überprüfe die URL oder wähle einen anderen Text.
          </p>

          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r flex gap-2 items-center from-sky-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:brightness-110 transition"
          >
            <ArrowLeft className="w-4 h-4" fill="#fff" />
            Zurück zur Startseite
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="z-20 w-full max-w-7xl pt-10">
      <ResultsHeader
        textType={COURSE_TYPES.LESERBRIEF}
        passed={history?.passed}
        overallScore={history?.total}
        userId={user.id}
      />
      {entries && <CategoryDonutGrid categories={categories} />}
      <div className="relative mt-10 bg-white/60 backdrop-blur-sm border border-[#d0e7ff] rounded-3xl shadow-lg p-10 sm:p-3 z-10 overflow-hidden">
        <div className="absolute top-20 -left-0 w-44 h-44 bg-gradient-to-br from-[#00A6F4]/90 to-[#3b82f6]/70 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute top-50 right-[200px] w-44 h-44 bg-gradient-to-br from-[#00A6F4]/90 to-[#3b82f6]/70 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-2 w-44 h-44 bg-gradient-to-br from-orange-400/70 to-orange-300/60 rounded-full blur-3xl animate-pulse z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6 w-full ">
          {categoriesBySub.map((cat, i) => (
            <CategoryBreakdown key={i} title={cat.title} sub={cat.sub} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withProtectedUserPage(ResultsPage);
