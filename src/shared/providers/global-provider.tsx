"use client";

import { SideBar } from "@/components";
import { Session } from "@supabase/supabase-js";
import { redirect, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { setUserSession } from "../hooks/useAuth";

type Props = {
  children: ReactNode | ReactNode[];
  session: Session | null;
};

export const GlobalProvider: React.FC<Props> = ({ children, session }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!session && pathname !== "/unauthenticated") {
      setUserSession(null);
      redirect("/unauthenticated");
    } else if (session) {
      setUserSession(session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      {session && <SideBar session={session} />}
      {children}
    </>
  );
};
