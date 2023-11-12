"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export const LogoutOnProfile = async () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <div onClick={handleLogout} className="w-8 h-8 bg-gray-700 rounded-full">
      {/* {user ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
            ) : null} */}
    </div>
  );
};
