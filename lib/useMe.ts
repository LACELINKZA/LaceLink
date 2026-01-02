"use client";
import { useSession } from "next-auth/react";

export function useMe() {
  const { data, status } = useSession();
  const user = data?.user as any;
  return {
    status,
    user,
    isAuthed: status === "authenticated",
    role: user?.role as string | undefined,
    userId: user?.id as string | undefined,
  };
}
