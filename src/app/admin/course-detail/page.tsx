// src/app/admin/course-detail/page.tsx
"use client";

import withProtectedAdminPage from "@/app/context/admin/withProtectedAdminPage";
import { useAdminCourseDetail } from "@/app/hooks/useAdminCourseDetail";
import { Button } from "@/app/ui/components/Button";
import { DeleteModal } from "@/app/ui/components/DeleteModal";
import { Robot } from "@/app/ui/components/Robot";
import { Tag } from "@/app/ui/components/Tag";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { GoPackage } from "react-icons/go";
import { PiKeyReturnBold } from "react-icons/pi";

const AdminCourseDetailPage: React.FC = () => {
  const router = useRouter();
  const search = useSearchParams();
  const courseId = search.get("courseId") || "";

  const {
    data: course,
    isLoading,
    error,
    addCode,
    deleteCode,
    adding,
    deletingId,
  } = useAdminCourseDetail(courseId);

  const [toDelete, setToDelete] = useState<string | null>(null);

  // redirect if no courseId
  if (!courseId) {
    router.replace("/admin");
    return null;
  }

  if (isLoading) {
    return <Robot />;
  }
  if (error || !course) {
    return <p className="p-4 text-red-600">Failed to load course details.</p>;
  }

  const active = course.coupons.filter((c) => !c.redeemed);
  const redeemed = course.coupons.filter((c) => c.redeemed);

  return (
    <article className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">{course.title}</h1>

      {/* Modules */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.modules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#d0e7ff] shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{mod.title}</h3>
              <p className="text-sm text-gray-600">
                Created:{" "}
                {format(
                  new Date(
                    //@ts-ignore
                    mod.explanationVideoUrl ? mod.createdAt : course.createdAt
                  ),
                  "dd.MM.yyyy"
                )}
              </p>
              <Button
                className="mt-2"
                onClick={() =>
                  router.push(`/admin/courses/${courseId}/modules/${mod.id}`)
                }
              >
                Edit Module
              </Button>
            </div>
          ))}
          <div className="p-4 flex items-center justify-center">
            <Button
              onClick={() =>
                router.push(`/admin/courses/${courseId}/modules/new`)
              }
            >
              <GoPackage className="mr-2" /> Create Module
            </Button>
          </div>
        </div>
      </section>

      {/* Active coupons */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Active Coupons</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {active.length ? (
            active.map((c) => (
              <Tag
                key={c.id}
                label={c.code}
                deleteable
                disabled={deletingId === c.id}
                onDelete={() => setToDelete(c.id)}
              />
            ))
          ) : (
            <span className="italic text-gray-600">No active coupons.</span>
          )}
        </div>
        <Button onClick={addCode} disabled={adding}>
          <PiKeyReturnBold className="mr-1" /> Generate Coupon
        </Button>
      </section>

      {/* Redeemed coupons */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Redeemed Coupons</h2>
        <div className="flex flex-wrap gap-2">
          {redeemed.length ? (
            redeemed.map((c) => <Tag key={c.id} label={c.code} disabled />)
          ) : (
            <span className="italic text-gray-600">None yet.</span>
          )}
        </div>
      </section>

      {/* Confirm deletion */}
      {toDelete && (
        <DeleteModal
          headline="Really delete this coupon?"
          isDeleting={deletingId === toDelete}
          onDelete={() => {
            deleteCode(course.coupons.find((c) => c.id === toDelete)!);
            setToDelete(null);
          }}
          onClose={() => setToDelete(null)}
        />
      )}
    </article>
  );
};

export default withProtectedAdminPage(AdminCourseDetailPage);
