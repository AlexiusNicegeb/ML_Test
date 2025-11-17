"use client";

import { useUserAuth } from "@/app/context/user/UserAuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { UserAvatar } from "./UserAvatar";
import { NavigationLinks, UserNavigation } from "./UserNavigation";

export const UserHeader = () => {
  const currentPath = usePathname();
  const { user } = useUserAuth();

  const ADMIN_NAVIGATION_LINKS = [
    {
      path: "/admin",
      label: "Dashboard",
    },
    {
      path: "/admin/my-courses",
      label: "Kurse",
    },
    // {
    //   path: "/admin/word-game",
    //   label: "Schreibtrainer",
    // },
  ];

  const pageLinks: NavigationLinks = useMemo(() => {
    const links: NavigationLinks = [];

    if (user) {
      links.push({
        path: "/",
        label: "Home",
      });

      links.push({
        path: "/my-courses",
        label: "Meine Kurse",
      });

      /* links.push({
        path: "/learning-assistant",
        label: "Lernassistent",
      });*/

      // links.push({
      //   path: `/play/${encodeURIComponent(GAMES[0])}`,
      //   label: "Spielen",
      // });

      // links.push({
      //   path: "/word-game",
      //   label: "Schreibtrainer",
      // });

      links.push({
        path: `/result`,
        label: "Resultate",
      });

      links.push({
        path: "/test-tool",
        label: "Schreibtrainer",
      });

      if (user?.role === "ADMIN") {
        links.push({
          path: "/admin",
          label: "Admin",
        });
      }
    }
    return links;
  }, [user]);

  return (
    <header className="user-header">
      <div className="header-wrapper">
        <Link className="logo" href="/">
          <img src="/maturahilfe-logo.svg" alt="Whizible Learning" />
        </Link>
        <UserNavigation
          links={
            currentPath.startsWith("/admin")
              ? ADMIN_NAVIGATION_LINKS
              : pageLinks
          }
        />
        <UserAvatar />
      </div>
    </header>
  );
};
