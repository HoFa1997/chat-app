"use client";

import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
import { supabaseClient } from "@/api/supabase";
import { Box } from "@mui/material";

export default function LoginForm() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Auth
        supabaseClient={supabaseClient}
        view="sign_in"
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        showLinks={false}
        providers={["google"]}
        redirectTo="http://localhost:3000/auth/callback"
      />
    </Box>
  );
}
