import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = `https://ws.crmolivosvillavicencio.com/app/getCamposFormulario02.php`;

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
}
