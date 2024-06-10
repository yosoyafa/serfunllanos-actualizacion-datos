import { Session, getSession } from "@/lib";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cc = searchParams.get("cc");

  try {
    const session = (await getSession()) as Session;
    if (!session) {
      const response = NextResponse.json(
        { error: "Session expired" },
        { status: 401, statusText: "Session expired" },
      );
      response.cookies.set("session", "", { expires: new Date(0), path: "/" });
      return response;
    }

    const apiUrl = `${session.user.url}getCarterabyCedula.php?user_id=${session.user.id}+&NumeroDocumento=${cc}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log({ error });
    const response = NextResponse.json(
      { error },
      { status: 500, statusText: "No se encontro el cliente" },
    );
    return response;
  }
}
