// src/app/api-client/admin.ts

import { getToken } from "@/lib/auth";

export interface AdminModule {
  id: number;
  title: string;
  description?: string;
  position: number;
  explanationVideoUrl: string;
  explanationVideoDuration?: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountPercent: number;
  validFrom: string;
  validTo?: string | null;
  redeemed: boolean;
  redeemedAt?: string | null;
}

export interface AdminCourseDetail {
  id: number;
  title: string;
  description?: string;
  mediaUrl: string;
  price: number;
  discount?: number;
  discountExpiresAt?: string | null;
  createdAt: string;
  modules: AdminModule[];
  coupons: AdminCoupon[];
}

/** Fetch full course‐with‐modules+coupons for admin */
export async function getAdminCourse(
  courseId: string
): Promise<AdminCourseDetail> {
  const token = await getToken();
  const res = await fetch(`/api/admin/courses/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch course details");
  return res.json();
}

/** Create a new coupon for this course */
export async function createCoupon(courseId: string): Promise<AdminCoupon> {
  const token = await getToken();
  const res = await fetch(`/api/admin/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
  if (!res.ok) throw new Error("Failed to create coupon");
  return res.json();
}

/** Delete an existing coupon */
export async function deleteCoupon(couponId: string): Promise<void> {
  const token = await getToken();
  const res = await fetch(`/api/admin/coupons/${couponId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete coupon");
}
