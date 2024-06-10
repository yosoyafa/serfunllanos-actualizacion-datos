import { NextResponse, NextRequest } from "next/server";
import md5 from "md5";
import { createSessionToken } from "@/lib";

interface LoginBody {
  user_name: string;
  password: string;
  latitud: number;
  longitud: number;
  fecha: string;
  nueva: number;
}

export async function POST(request: NextRequest) {
  const { user_name, latitud, longitud, fecha, nueva, password }: LoginBody =
    await request.json();

  const apiUrl = `https://integracionip.com/app/getUser.php?user_name=${user_name}&latitud=${latitud}&longitud=${longitud}&fecha=${fecha}&nueva=${nueva}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Login Network response was not ok");
    }
    const data: User = await response.json();
    const userHash = data.user_hash;
    const localHash = md5(password);

    if (userHash === localHash) {
      const sessionToken = await createSessionToken(data);
      const response = NextResponse.json({ message: "Logged in successfully" });
      response.cookies.set("session", sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 86400,
      });
      return response;
    } else {
      return NextResponse.json(
        { message: "Usuario o contrasena incorrecta." },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
