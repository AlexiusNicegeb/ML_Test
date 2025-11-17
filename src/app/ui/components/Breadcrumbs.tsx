"use client";

import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";

interface BreadcrumbsProps {
  courseId?: string;
  courseName?: string;
  lectureName?: string;
}

export const Breadcrumbs = ({
  courseId,
  courseName,
  lectureName,
}: BreadcrumbsProps) => {
  // Always show Home > My Courses
  const crumbs: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
    { label: "My Courses", href: "/my-courses" },
  ];

  // If we're on a course page (courseId + courseName passed), add that
  if (courseId && courseName) {
    crumbs.push({
      label: courseName,
      href: `/course-detail/${courseId}`,
    });
  }

  // If we're on a lecture page, add the lectureName (no href)
  if (lectureName) {
    crumbs.push({ label: lectureName });
  }

  return (
    <nav
      aria-label="breadcrumb"
      className="w-fit max-w-full px-6 py-3 bg-white/60 backdrop-blur-md rounded-xl shadow border border-[#c0d7f0] flex items-center gap-3 text-base text-[#555] overflow-auto"
    >
      {crumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <HiChevronRight className="text-[#00A6F4]" size={20} />}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-[#00A6F4] font-semibold hover:underline hover:text-orange-500 transition"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#000] font-extrabold">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
