import { useEffect, useState } from "react";

const useCiudades = () => {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const fetchCiudades = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fields/data/ciudades");
      if (!res.ok) {
        setError(res.statusText);
        throw new Error(res.statusText);
      }

      const fetched: Barrio[] = await res.json();
      setCiudades(
        Array.from(new Map(fetched.map((item) => [item.id, item])).values()),
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCiudades();
  }, []);

  return {
    ciudades,
    isLoading,
    error,
  };
};

export { useCiudades };
