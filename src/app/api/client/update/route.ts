import { withSession } from "@/app/hocs/withSession";
import { getSession } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const POST = withSession(async (request: NextRequest) => {
  const body = await request.json();

  const session = await getSession();

  try {
    const response = await fetch(
      `${session?.user.url}getUpdateInfoapp.php`,
      {
        method: "POST",
        body: {
          ...JSON.parse(body),
          user_id: session?.user.id,
        },
      },
    );
    console.log({response})

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log({resp: NextResponse.json(data)})

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post update" },
      { status: 500 },
    );
  }
});
