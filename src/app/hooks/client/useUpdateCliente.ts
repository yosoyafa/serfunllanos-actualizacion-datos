import { useState } from "react";

const useUpdateCliente = (fields: Field[]) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const updateCliente = async ({
    data,
    cliente,
  }: {
    data: FormData;
    cliente: Client;
  }) => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
    const formData = fields.map(({ name }) => ({
      field: name,
      newValue: data.get(name)?.toString(),
      oldValue: cliente?.[name],
    }));

    try {
      const res = await fetch("/api/client/update", {
        method: "POST",
        body: JSON.stringify({ updateData: formData }),
      });

      if (!res.ok) {
        setError(res.statusText);
        throw new Error(res.statusText);
      }

      setIsSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSuccess,
    isLoading,
    error,
    updateCliente,
  };
};

export { useUpdateCliente };
