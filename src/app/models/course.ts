export interface Course {
  id: number; // previously 'id: string'
  courseCode: string; // previously 'code'
  slug?: string;
  title: string;
  description?: string;
  mediaUrl: string; // previously 'previewImageUrl'
  price: number;
  discount?: number; // previously 'discountPercent'
  discountExpiresAt?: number | null;
  createdAt: number;
  tags: string[]; // replaces your 'courseCodes?' field
}
