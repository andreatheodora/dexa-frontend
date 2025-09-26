import { useEffect } from "react";
import { useRouter } from "next/navigation";

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() > payload.exp * 1000;
  } catch (error) {
    return true;
  }
}

export function useAuthTokenCheck() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("is_hr");

      router.push("/");
    }
  }, [router]);
}
