"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUserAuth } from "../context/user/UserAuthContext";
import { Button } from "../ui/components/Button";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function Register() {
  const [actionPerforming, setActionPerforming] = useState(false);
  const { register: registerUser } = useUserAuth();
  const { register, handleSubmit, getValues } = useForm<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>({});
  const router = useRouter();

  const onSubmit = async () => {
    if (actionPerforming) return;

    setActionPerforming(true);
    try {
      const { email, password, firstName, lastName } = getValues();

      await registerUser(email, password, firstName, lastName);

      toast.success("Registration successful! Please log in.");
      setTimeout(() => {
        router.push("/login");
      }, 1300);
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(`❌ ${err.message || "Registration error"}`);
    } finally {
      setActionPerforming(false);
    }
  };

  // if (registered) {
  //   return (
  //     <div className="flex justify-center items-start mt-12">
  //       <p className="text-xl">
  //         Wir haben dir eine E-Mail geschickt, bitte bestätige diese und logge
  //         dich ein.
  //       </p>
  //     </div>
  //   );
  // }

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
          Registrieren
        </h1>

        <div className="mb-6">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Vorname
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Max"
            className="w-full px-4 py-3 border border-[#d0e7ff] rounded-full bg-white/70 text-black shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A6F4]"
            {...register("firstName", { required: true })}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Nachname
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Muster"
            className="w-full px-4 py-3 border border-[#d0e7ff] rounded-full bg-white/70 text-black shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A6F4]"
            {...register("lastName", { required: true })}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="Email"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Email
          </label>
          <input
            id="Email"
            type="email"
            placeholder="Deine E-Mail"
            className="w-full px-4 py-3 border border-[#d0e7ff] rounded-full bg-white/70 text-black shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A6F4]"
            {...register("email", { required: true })}
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="Password"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Passwort
          </label>
          <input
            id="Password"
            type="password"
            placeholder="Dein Passwort"
            className="w-full px-4 py-3 border border-[#d0e7ff] rounded-full bg-white/70 text-black shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A6F4]"
            {...register("password", { required: true })}
          />
        </div>

        <Button
          disabled={actionPerforming}
          className="w-full justify-center bg-[#00A6F4] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#0095e0] hover:shadow-lg transition"
          type="submit"
          id="Submit"
        >
          Registrieren
        </Button>
      </motion.form>
    </div>
  );
}
