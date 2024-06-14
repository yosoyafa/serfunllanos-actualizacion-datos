import { useEffect, useState } from "react";

const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const fetchFields = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fields");
      if (!res.ok) {
        setError(res.statusText);
        throw new Error(res.statusText);
      }

      const fetchedFields: Field[] = await res.json();
      setFields(fetchedFields);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return {
    fields,
    isLoading,
    error,
  };
};

export { useFields };
