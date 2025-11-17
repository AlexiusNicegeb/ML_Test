// src/app/admin/hooks/useAdminCourseDetail.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAdminCourse,
  createCoupon,
  deleteCoupon,
  AdminCourseDetail,
  AdminCoupon,
} from "@/app/api-client/admin";
import { TOAST_DEFAULT_CONFIG, TOAST_DEFAULT_MESSAGE } from "@/app/constants";

export function useAdminCourseDetail(courseId: string) {
  const [data, setData] = useState<AdminCourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1️⃣ Fetch course + modules + coupons
  useEffect(() => {
    let canceled = false;
    (async () => {
      setIsLoading(true);
      try {
        const details = await getAdminCourse(courseId);
        if (!canceled) setData(details);
      } catch (err) {
        console.error(err);
        setError(true);
        toast.error(TOAST_DEFAULT_MESSAGE, TOAST_DEFAULT_CONFIG);
      } finally {
        if (!canceled) setIsLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [courseId]);

  // 2️⃣ Add a coupon
  const addCode = useCallback(async () => {
    if (!data) return;
    setAdding(true);
    try {
      const newCode = await createCoupon(courseId);
      setData((d) => d && { ...d, coupons: [newCode, ...d.coupons] });
    } catch (err) {
      console.error(err);
      toast.error(TOAST_DEFAULT_MESSAGE, TOAST_DEFAULT_CONFIG);
    } finally {
      setAdding(false);
    }
  }, [courseId, data]);

  // 3️⃣ Delete a coupon
  const deleteCode = useCallback(async (coupon: AdminCoupon) => {
    setDeletingId(coupon.id);
    try {
      await deleteCoupon(coupon.id);
      setData(
        (d) =>
          d && { ...d, coupons: d.coupons.filter((c) => c.id !== coupon.id) }
      );
    } catch (err) {
      console.error(err);
      toast.error(TOAST_DEFAULT_MESSAGE, TOAST_DEFAULT_CONFIG);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    addCode,
    deleteCode,
    adding,
    deletingId,
  };
}
