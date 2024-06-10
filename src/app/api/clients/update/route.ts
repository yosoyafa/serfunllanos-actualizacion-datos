import { NextRequest, NextResponse } from "next/server";

interface UpdateBody {
  user_name: string;
  password: string;
  latitud: number;
  longitud: number;
  fecha: string;
  nueva: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  //const apiUrl = `https://${user.url}getUpdateInfo2.php?user_name=${user.user_name}&latitud=${lat}&longitud=${lon}&numerodocumento=${cc}&fecha=${fecha}&user_id=${user.id}&celular1_o=${tel1viejo}&celular1_n=${tel1nuevo}&celular2_o=${tel2viejo}&celular2_n=${tel2nuevo}&email_o=${emailViejo}&email_n=${emailNuevo}&direccion_o=${direccionVieja}&direccion_n=${direccionNueva}&barrio_o=${barrioViejo}&barrio_n=${barrioNuevo}&indicaciones_o=${indicacionVieja}&indicaciones_n=${indicacionNueva}&dia_cobro_o=${diaCobroViejo}&dia_cobro_n=${diaCobroNuevo}&nueva=${1}`;

  try {
    const response = await fetch(`apiUrl`);
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
