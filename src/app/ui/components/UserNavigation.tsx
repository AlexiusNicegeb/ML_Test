"use client";
import { useUserAuth } from "@/app/context/user/UserAuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BurgerMenu } from "./BurgerMenu";

export type NavigationLinks = { path: string; label: string }[];

interface UserNavigationProps {
  links: NavigationLinks;
}

export const UserNavigation = ({ links }: UserNavigationProps) => {
  const currentPath = usePathname();
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const { user, logout } = useUserAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLink = (label: string, path?: string, callback?: () => void) => {
    const baseClasses =
      "block px-6 py-2 text-lg transition-colors duration-200";
    const activeClasses = "text-[#00A6F4] font-bold";
    const inactiveClasses = "text-black hover:text-orange-500";

    if (callback) {
      return (
        <button
          onClick={() => {
            setIsBurgerOpen(false);
            setTimeout(callback, 300);
          }}
          className={`${baseClasses} ${inactiveClasses}`}
        >
          {label}
        </button>
      );
    }

    return (
      <Link
        href={path || "/"}
        onClick={() => setIsBurgerOpen(false)}
        id={isMobile && label === "Resultate" ? "results" : undefined}
        className={`${baseClasses} ${
          currentPath === path ? activeClasses : inactiveClasses
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <div
        className={`${isBurgerOpen ? "fixed z-[9999]" : "absolute"}  top-0 right-0 `}
      >
        <BurgerMenu open={isBurgerOpen} onToggle={setIsBurgerOpen} />
      </div>

      <nav
        className={`fixed top-0 left-0 w-full h-screen overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 z-50 backdrop-blur-md transition-transform duration-300 ${
          isBurgerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col items-center justify-center h-screen gap-6 px-4">
          {links.map((link, index) => (
            <li
              key={link.path}
              className={`w-[200px] rounded-[20px] px-4 py-3 bg-white/90  shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_8px_30px_rgba(0,0,0,0.12)] 
        backdrop-blur-lg text-center font-semibold text-white tracking-wide
        hover:shadow-[0_0_10px_2px_rgba(0,166,244,0.6)] hover:scale-105 transition-all duration-300 
        ${
          currentPath === link.path
            ? "ring-2 ring-[#00A6F4] shadow-[0_0_20px_rgba(0,166,244,0.6)]"
            : ""
        }`}
              style={{ animation: `fadeIn 0.3s ease ${index * 0.1}s both` }}
            >
              {getLink(link.label, link.path)}
            </li>
          ))}

          <li className="mt-6 w-[200px] rounded-[20px] px-4 py-3 text-center font-semibold text-black bg-white/70 flex items-center justify-center text-opacity-80 backdrop-blur-md shadow-inner hover:scale-105 transition-all duration-300">
            {user
              ? getLink("Logout", undefined, () => logout())
              : getLink("Login", "/login")}
          </li>

          {!user && (
            <li className="mt-2 w-[200px] rounded-[20px] px-4 py-3 text-center font-semibold text-black bg-white/70 flex items-center justify-center text-opacity-80 backdrop-blur-md shadow-inner hover:scale-105 transition-all duration-300">
              {getLink("Registrieren", "/register")}
            </li>
          )}
        </ul>
      </nav>

      {/* DESKTOP NAVIGATION */}
      <nav className="lg:hidden flex items-center gap-6">
        <ul className="flex items-center gap-6">
          {links.map((link) => (
            <li
              id={link.label === "Resultate" ? "results" : undefined}
              key={link.path}
            >
              {getLink(link.label, link.path)}
            </li>
          ))}

          <li className="hidden sm:block text-sm">
            {user
              ? getLink("Logout", undefined, () => logout())
              : getLink("Login", "/login")}
          </li>
        </ul>
      </nav>
    </>
  );
};
