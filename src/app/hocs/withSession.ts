import { Session, getSession } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const withSession = (
  handler: (
    request: NextRequest,
    response: NextResponse,
  ) => Promise<NextResponse<{ error: string }> | undefined>,
) => {
  return async (req: NextRequest, res: NextResponse) => {
    const session = (await getSession()) as Session;

    if (!session) {
      const response = NextResponse.json(
        { error: "Session expired" },
        { status: 401, statusText: "Session expired" },
      );
      response.cookies.set("session", "", { expires: new Date(0), path: "/" });

      // Perform logout on the backend (optional)
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      return response;
    }

    return handler(req, res);
  };
};
