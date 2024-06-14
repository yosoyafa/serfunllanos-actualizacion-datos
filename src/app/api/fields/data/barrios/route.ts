import { withSession } from "@/app/hocs/withSession";
import { NextResponse } from "next/server";

export const GET = withSession(async () => {
  const apiUrl = `https://ws.crmolivosvillavicencio.com/app/getBarrios.php`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
});
