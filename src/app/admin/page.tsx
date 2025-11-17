"use client";

import withProtectedAdminPage from "@/app/context/admin/withProtectedAdminPage";
import { useUserAuth } from "@/app/context/user/UserAuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

function Admin() {
  const { user } = useUserAuth();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[95%] max-w-5xl bg-white/60 backdrop-blur-lg border border-[#d0e7ff] rounded-3xl shadow-2xl mt-20 p-10 sm:p-4 sm:mt-10 relative z-10"
      >
        <div className="flex flex-col sm:flex-col  gap-10 sm:gap-2 items-center">
          <div className="flex flex-col items-start gap-3 md:basis-1/2">
            <h1 className="text-4xl sm:text-xl font-extrabold text-[#003366] mb-0">
              {`Willkommen, ${(user && user?.firstName) || "Lehrer:In"}`}
            </h1>

            <ul>
              <li className="mb-2 underline">
                <Link href="/admin/grammar">Grammatik/Rechtschreibung</Link>
              </li>
              <li className="mb-2 underline">
                <Link href="/admin/text-types">Textsorten</Link>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default withProtectedAdminPage(Admin);
