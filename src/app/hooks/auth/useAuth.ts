import { useRouter } from "next/navigation";
import { useState } from "react";

const useAuth = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          user_name: username,
          password,
          latitud: 1,
          longitud: 1,
          fecha: new Date().toLocaleDateString("en-GB"),
          nueva: 1,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
};

export { useAuth };
