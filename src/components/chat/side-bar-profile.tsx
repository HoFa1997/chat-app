import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { LogoutOnProfile } from "./logout-on-profile";

export const SideBarProfile = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex items-center">
      <div className="mr-2 text-sm font-medium">{session?.user?.email}</div>
      <LogoutOnProfile />
    </div>
  );
};
