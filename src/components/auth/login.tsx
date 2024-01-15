import { FcGoogle } from "react-icons/fc";
import { signInWithOAuth } from "@/api/auth";
import SignInWithPasswordForm from "./signInWithPasswordForm";
import { Provider } from "@supabase/supabase-js";
import { useSupabase } from "@/shared";

export default function LoginForm() {
  const { loading, request, setLoading } = useSupabase(signInWithOAuth, null, false);

  // Handle authentication with OAuth
  const handleOAuthSignIn = async (provider: Provider) => {
    try {
      await request({
        provider,
        options: {
          redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO,
        },
      });
      // set loading true untile the redirect to login
      setLoading(true);
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
    }
  };

  return (
    <div className="prose flex h-dvh max-w-full items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title my-2 mb-4">Sign in to your account</h2>
          <button className="btn w-full" onClick={() => handleOAuthSignIn("google")} disabled={loading}>
            <FcGoogle size={26} /> Sign in with Google
            {loading && <span className="loading loading-spinner ml-auto"></span>}
          </button>
          <div className="divider"></div>
          <SignInWithPasswordForm />
        </div>
      </div>
    </div>
  );
}
