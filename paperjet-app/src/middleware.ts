import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "./lib/session";
import {
  FORGOT_PASSWORD_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
} from "./lib/config/routes";

const unprotectedRoutes = [
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  FORGOT_PASSWORD_ROUTE,
];

export async function middleware(request: NextRequest) {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    console.warn("Session cookie is missing");
  }

  const session = await decrypt(cookie!);
  console.log("session", session);

  // If there is no session and the route is protected, redirect to login
  if (
    !session?.userId &&
    !unprotectedRoutes.some((route) =>
      request.nextUrl.pathname === route,
    )
  ) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.nextUrl));
  }

  // If the pathname starts with /admin, check if the user is an admin, otherwise redirect to home
  if (request.nextUrl.pathname.startsWith("/admin") && !session?.isAdmin) {
    return NextResponse.redirect(new URL(HOME_ROUTE, request.nextUrl));
  }

  // Render route
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
