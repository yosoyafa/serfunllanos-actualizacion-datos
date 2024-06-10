import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Clear the session cookie by setting its value to an empty string and setting the expiration to a past date
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set("session", "", { expires: new Date(0), path: "/" });
  return response;
}
