export interface GermanErrorCategoryDto {
  id: string;
  name: string;
  createdAt: number;
  parentId?: string;
  errors?: GermanError[];
}

export interface GermanErrorExample {
  id: string;
  name: string;
  createdAt: number;
}

export interface GermanError {
  id: string;
  name: string;
  createdAt: number;
  examples?: GermanErrorExample[];
}

export interface GermanErrorCategory {
  id: string;
  name: string;
  createdAt: number;
  parentId?: string;
  subCategories: GermanErrorCategory[];
  errors: GermanError[];
}
