import { useState } from "react";

const useFetchCliente = (options?: { onAbort?: () => void }) => {
  const [cliente, setCliente] = useState<Client>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const fetchCliente = async (cedula: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/client/fetch?cc=${cedula}`);
      if (!res.ok) {
        setError(res.statusText);
        throw new Error(res.statusText);
      }

      const data = await res.json();

      setCliente(data[0] as Client);
    } catch (error) {
      setError((error as Error).message);
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
