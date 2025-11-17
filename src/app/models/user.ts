export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

export const cloneUser = (u: User): User => ({
  ...u,
});
