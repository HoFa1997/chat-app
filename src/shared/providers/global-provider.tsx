"use client";

import { Session } from "@supabase/auth-helpers-nextjs";
import { redirect, usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode | ReactNode[];
  session: Session | null;
};

export const GlobalProvider: React.FC<Props> = ({ children, session }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!session && pathname !== "/unauthenticated") {
      redirect("/unauthenticated");
    }
  }, [pathname, session]);

  return <>{children}</>;
};
