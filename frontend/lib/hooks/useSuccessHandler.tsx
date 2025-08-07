import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSuccessHandler(redirectPath?: string) {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const closeSuccessModal = () => {
    setShowSuccess(false);
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const openSuccessModal = () => {
    setShowSuccess(true);
  };

  return {
    showSuccess,
    closeSuccessModal,
    openSuccessModal,
  };
}
