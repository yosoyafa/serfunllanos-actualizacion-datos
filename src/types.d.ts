type Field = {
  id: number;
  title: string;
  name: keyof Client;
  type: "text" | "list";
  opciones?: {
    list: { id: number; name: string }[];
  };
};

type Barrio = {
  id: string;
  nombre: string;
};

type Ciudad = {
  id: string;
  nombre: string;
};

type User = {
  user_name?: string;
  first_name?: string;
  last_name?: string;
  user_hash?: string;
  id?: string;
  iniciales_numerador?: string;
  numerador_rc_manual?: string;
  agencia?: string;
  puntodeventa?: string;
  nit?: string;
  telefono?: string;
  impresora?: string;
  servidor?: string;
  url?: string;
};

type Client = {
  name: string;
  numero_documento: string;
  totalcartera: number;
  vigenciadesde: Date;
  vigenciahasta: Date;
  numeropoliza: string;
  valorcontrato: string;
  periodicidad1: string;
  celular1: string;
  celular2: string;
  direccion: string;
  idbarrio: string;
  idciudad: string;
  dia_cobro: string;
  indicaciones: string;
  email: string;
  recuperado: string;
  edadcartera_c: string;
  barrio: string;
};
