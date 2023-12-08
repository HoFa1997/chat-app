"use client";

import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
import { supabaseClient } from "@/api/supabase";
import { Box, Typography } from "@mui/material";

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
      <Box
        style={{
          border: "2px solid #aaa",
          padding: "1.5rem",
          width: "400px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" align="center" pb={2}>
          Sign in to your account
        </Typography>
        <Auth
          supabaseClient={supabaseClient}
          view="sign_in"
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          showLinks={false}
          providers={["google"]}
          redirectTo={process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO}
        />
      </Box>
    </Box>
  );
}
