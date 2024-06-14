import { useState } from "react";

const useFetchCliente = (options?: { onAbort?: () => void }) => {
  const [cliente, setCliente] = useState<Client | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const fetchCliente = async (cedula: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/client/fetch?cc=${cedula}`);

      if (!res.ok) {
        setError(res.statusText);
        if (res.status === 401 && options?.onAbort) {
          options.onAbort();
        }
      }

      const data = await res.json();

      setCliente(data[0] as Client);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cliente,
    fetchCliente,
    isLoading,
    error,
  };
};

export { useFetchCliente };
