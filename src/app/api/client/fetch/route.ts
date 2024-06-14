import { withSession } from "@/app/hocs/withSession";
import { Session, getSession } from "@/lib";
import { NextResponse } from "next/server";

export const GET = withSession(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const cc = searchParams.get("cc");

  try {
    const session = (await getSession()) as Session;
    const apiUrl = `${session.user.url}getCarterabyCedula.php?user_id=${session.user.id}+&NumeroDocumento=${cc}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log({ data });

    return NextResponse.json(data);
  } catch (error) {
    const response = NextResponse.json(
      { error },
      { status: 500, statusText: "No se encontro el cliente" },
    );
    return response;
  }
});
