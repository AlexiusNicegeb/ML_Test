
export interface CourseCode {
  id: string;
  code: string;
  createdAt: number;
  userId: string;
  courseId: string;
  redeemed: boolean;
}

/** English: deep-clone helper for CourseCode */
export const cloneCourseCode = (cc: CourseCode): CourseCode => ({
  ...cc,
});
