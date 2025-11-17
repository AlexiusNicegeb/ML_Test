"use client";

import { UserAuthProvider } from "../context/user/UserAuthContext";

export function UserProviders({ children }: { children: React.ReactNode }) {
  return <UserAuthProvider>{children}</UserAuthProvider>;
}
