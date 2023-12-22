import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let checkIfCookieExists = false;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          checkIfCookieExists = request.cookies.get(name)?.value ? true : false;
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
      },
    },
  );

  // Attempt to retrieve the current session
  const { data, error } = await supabase.auth.getSession();

  // If no valid session
  if (!data.session && checkIfCookieExists) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue with the original response if the session is valid
  return response;
}

// Middleware configuration
export const config = {
  matcher: [
    // The regular expression below is used to specify the paths where the middleware will be applied.
    // '/((?!api|_next/static|_next/image|favicon.ico).*)' means that the middleware will run on all paths,
    // except those that start with 'api', '_next/static', '_next/image', or 'favicon.ico'.
    // This effectively excludes API routes, static files, image optimization files, and favicon requests.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
