import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "../utils/authToken";

export function useAuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("signin");
    }
  }, [router]);
}
