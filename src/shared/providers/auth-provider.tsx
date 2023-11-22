"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export const AuthProvider = ({ children, session }: { children: ReactNode; session: any }) => {
  const { replace } = useRouter();
  useEffect(() => {
    if (!session) {
      replace("/unauthenticated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
