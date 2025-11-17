// src/app/login/page.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserAuth } from "../context/user/UserAuthContext";
type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { user, login, loading: userLoading } = useUserAuth();

  useEffect(() => {
    if (user && !userLoading) {
      router.replace("/");
    }
  }, [router, userLoading, user]);

  async function onSubmit(data: FormData) {
    setLoading(true);
    setErrorMessage(null);

    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setErrorMessage(err.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-[85dvh] bg-gradient-to-br from-[#bfdbfe] via-[#93c5fd] to-[#7dd3fc] relative px-4">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-[-40px] left-[-40px] w-52 h-52 bg-[#00A6F4]/50 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-[-40px] right-[-40px] w-72 h-72 bg-orange-300/50 rounded-full blur-3xl animate-pulse z-0"></div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-sm border border-[#d0e7ff] rounded-[32px] shadow-xl p-10 z-10 sm:p-2"
      >
        <h1 className="mb-6 sm:mb-3 text-4xl sm:text-3xl font-extrabold text-[#111] text-center drop-shadow">
          Login
        </h1>

        {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Deine E-Mail"
            className="w-full px-4 py-3 border border-[#d0e7ff] rounded-full bg-white/70 text-black shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A6F4]"
            {...register("email", { required: true })}
            disabled={loading}
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Passwort
          </label>
          <input
            id="password"
            type="password"
            placeholder="Dein Passwort"
            className="w-full px-4 py-3 border border-[#d0e7ff] rounded-full bg-white/70 text-black shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A6F4]"
            {...register("password", { required: true })}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full justify-center bg-[#00A6F4] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#0095e0] hover:shadow-lg transition disabled:opacity-50"
          disabled={loading || formState.isSubmitting}
        >
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </motion.form>
    </div>
  );
}
