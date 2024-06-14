import { useEffect, useState } from "react";

const useBarrios = () => {
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const fetchBarrios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fields/data/barrios");
      if (!res.ok) {
        setError(res.statusText);
        throw new Error(res.statusText);
      }

      const fetched: Barrio[] = await res.json();
      setBarrios(
        Array.from(new Map(fetched.map((item) => [item.id, item])).values()),
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarrios();
  }, []);

  return {
    barrios,
    isLoading,
    error,
  };
};

export { useBarrios };
