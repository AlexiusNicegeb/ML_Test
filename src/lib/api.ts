import { prisma } from "@/lib/prisma";

export const saveWatchedAttempt = async (courseId: number, round: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const res = await fetch("/api/attempt-watched", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      courseId,
      round,
      watched: true,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Error saving watched attempt");
  }

  const data = await res.json();
  return data;
};

export const getCourseTypeResults = async (courseId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const res = await fetch("/api/course-type-results?courseId=" + courseId, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Error getting course type results");
  }

  const data = await res.json();
  return data;
};

export const getAllCourses = async () => {
  const res = await fetch("/api/all-courses");

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Error getting all courses");
  }

  const data = await res.json();
  return data;
};

export const getAllPackages = async () => {
  const res = await fetch("/api/all-packages");

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Error getting all packages");
  }

  const data = await res.json();
  return data;
};

export const fetchEnrolled = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const res = await fetch("/api/enrollments", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Error getting enrolled courses");
  }

  const data = await res.json();
  return data;
};

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Returns all users who have purchased/enrolled in the given course.
 * @param courseId  the numeric ID of the course (or its string form)
 */
export async function getCourseParticipants(
  courseId: string | number
): Promise<Participant[]> {
  // 1) normalize and validate courseId
  const id = typeof courseId === "string" ? parseInt(courseId, 10) : courseId;
  if (Number.isNaN(id)) {
    throw new Error(`Invalid courseId: ${courseId}`);
  }

  // 2) query CoursePurchase instead of enrollment
  const purchases = await prisma.coursePurchase.findMany({
    where: { courseId: id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // 3) extract the user from each purchase
  return purchases.map((p) => p.user);
}
