import { useState, FormEvent } from "react";
import { signInWithPassword } from "@/api/auth";
import { useSupabase } from "@/shared";
import toast from "react-hot-toast";

const SignInWithPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, setLoading, request } = useSupabase(signInWithPassword, null, false);

  // Handle email/password authentication
  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await request({ email, password });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
      setLoading(true);
    } catch (error) {
      console.error("Authentication error:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="flex w-full flex-col">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input
          type="email"
          placeholder="Enter your email ..."
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <input
          type="password"
          placeholder="password ..."
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button className="btn flex btn-block mt-6" type="submit" disabled={loading}>
        {loading && <span className="loading loading-spinner mr-auto"></span>}
        Login
      </button>
    </form>
  );
};

export default SignInWithPasswordForm;
