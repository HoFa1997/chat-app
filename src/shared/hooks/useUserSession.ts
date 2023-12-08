import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { TUser, getUser } from "@/api/auth";
type useUserSessionProps = {
  userId: string | null | undefined;
  enabled: boolean;
};
export const useGetUserSession = ({ userId, enabled }: useUserSessionProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (userId && enabled) {
      const fetchUser = async () => {
        try {
          const { data: userData } = await getUser(userId);
          if (userData) {
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error: any) {
          enqueueSnackbar(error.message, { variant: "error" });
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, enabled]);

  return { user, isLoading };
};
