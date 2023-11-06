"use client";
import { Session } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode | ReactNode[];
  session: Session | null;
};

export const AuthProvider: React.FC<Props> = ({ children, session }) => {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!session) {
      router.replace("/login");
    } else {
      router.push(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return <>{children}</>;
};
