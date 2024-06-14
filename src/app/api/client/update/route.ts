import { withSession } from "@/app/hocs/withSession";
import { getSession } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const POST = withSession(async (request: NextRequest) => {
  const body = await request.json();

  const session = await getSession();

  try {
    const response = await fetch(
      `https://${session?.user.url}getUpdateInfoapp.php`,
      {
        method: "POST",
        body: {
          ...body,
          user_id: session?.user.id,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post update" },
      { status: 500 },
    );
  }
});
