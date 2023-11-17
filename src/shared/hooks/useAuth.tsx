import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type UseIsUserLoggedIn = {
  session: Session | null;
};

const useUserAuthState = create<UseIsUserLoggedIn>(() => ({
  session: null,
}));

/**
 * Returns the current user session from the user authentication state.
 * @returns The current user session.
 */
export const useUserSession = () => useUserAuthState().session;

/**
 * Sets the user session in the application state.
 * @param session The user session to be set.
 */
export const setUserSession = (session: Session | null) =>
  useUserAuthState.setState({ session });
