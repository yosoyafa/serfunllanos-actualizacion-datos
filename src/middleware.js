import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const sessionCookie = req.cookies.get("session");

  // Check if the session cookie is present
  if (sessionCookie) {
    // Redirect to the home page if the session is valid
    if (url.pathname !== "/") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
