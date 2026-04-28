import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GoogleAuthButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  onNavigating?: (navigating: boolean) => void;
}

export default function GoogleAuthButton({
  label,
  isLoading = false,
  disabled = false,
  onNavigating,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleSignIn = async () => {
    const isActionBlocked = isLoading || disabled || isProcessing;
    if (isActionBlocked) {
      return;
    }

    // Supabase sends the user to Google, then redirects back to this route.
    const redirectTo = `${window.location.origin}/auth/callback`;

    try {
      setIsProcessing(true);
      onNavigating?.(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          // Request consent explicitly to reliably receive a provider token.
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          scopes: "email profile",
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      // OAuth popup/redirect setup failed before leaving the current page.
      onNavigating?.(false);
      setIsProcessing(false);

      const errorMessage =
        error instanceof Error
          ? `Google sign in failed: ${error.message}`
          : "Google sign in failed";

      handleError({
        name: "Google Sign In",
        statusCode: 400,
        message: errorMessage,
      });
      router.replace("/signin");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className={`w-full flex items-center justify-center py-5 px-4 text-sm rounded-2xl border border-gray-300 text-gray-700 bg-white  transition${
        isLoading || disabled || isProcessing
          ? "bg-gray-400 cursor-not-allowed "
          : " focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-50 cursor-pointer"
      }`}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {label}
    </button>
  );
}
