import { getToken } from "@/lib/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowAltCircleLeft,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
interface ResultsHeaderProps {
  textType: string;
  passed: boolean;
  overallScore: number;
  userId: string;
}

export const ResultsHeader = ({
  textType,
  passed,
  overallScore,
  userId,
}: ResultsHeaderProps) => {
  const currentDate = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [otherUser, setOtherUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/get-user?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        setOtherUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white/50 backdrop-blur-md border border-[#d0e7ff] rounded-3xl px-6 py-8 shadow-md w-full flex items-center  justify-center gap-4 animate-fadeIn">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute w-14 h-14 border-[3px] border-t-blue-500 border-b-transparent border-l-blue-500 border-r-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-[#0f172a]">
          <p className="text-lg font-bold mb-1">Profil wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/40 backdrop-blur-md border border-[#d0e7ff] rounded-3xl px-4 py-2 shadow-md w-full flex sm:flex-row justify-between items-center gap-6"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="sm:hidden w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-white text-[#00A6F4] font-bold flex items-center justify-center text-3xl shadow-md border border-[#d0e7ff] animate-fadeInGlow">
          {otherUser && otherUser?.firstName.charAt(0)}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl sm:text-lg mb-0 font-extrabold text-[#0f172a] drop-shadow-sm leading-tight">
            {otherUser && otherUser?.firstName + " " + otherUser?.lastName}
          </h1>
          <p className="text-sm text-slate-700 font-medium">
            Textsorte:{" "}
            <span className="font-semibold text-[#334155]">{textType}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Bewertung abgeschlossen am: {currentDate}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 flex-wrap justify-end ">
        {/* Passed Badge */}

        <button
          onClick={() => router.back()}
          className=" flex items-center gap-2  z-50 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-2 sm:px-2 sm:py-1 rounded-full font-bold text-sm sm:text-xs shadow-md cursor-pointer"
        >
          <FaArrowAltCircleLeft className="text-white " />
          <p>Zurück</p>
        </button>
        <div
          className={`flex items-center gap-2 px-4 py-2 sm:px-2 sm:py-1 rounded-full text-white font-semibold text-sm sm:text-xs shadow transition-all duration-300 ${passed ? "bg-gradient-to-r from-orange-400 to-orange-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`}
        >
          {passed ? (
            <FaCheckCircle className="text-white sm:hidden" />
          ) : (
            <FaTimesCircle className="text-white sm:hidden" />
          )}
          Textsorte gemeistert
        </div>

        {/* Score Pill */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-2 sm:px-2 sm:py-1  rounded-full font-bold text-sm sm:text-xs shadow-md">
          {overallScore} / 100 Punkte
        </div>
      </div>
    </motion.div>
  );
};
