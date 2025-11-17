export interface CoursePackage {
  id: number;
  title: string;
  slug?: string;
  description: string;
  mediaUrl: string;
  price: number;
  courseIds?: number[];
  createdAt: string;
  updatedAt: string;
}
