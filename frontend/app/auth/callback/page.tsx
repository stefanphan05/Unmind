"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithGoogle } from "@/lib/api/auth";
import { supabase } from "@/lib/supabase/client";
import { getPostLoginRedirectPath } from "@/lib/utils/getPostLoginRedirectPath";
import { useAuth } from "@/providers/auth-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const finishGoogleSignIn = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          throw new Error(error?.message ?? "No Supabase session found.");
        }

        const providerToken = data.session.provider_token;
        if (!providerToken) {
          throw new Error(
            "Missing provider token from Supabase. Check Google provider scopes in Supabase.",
          );
        }

        const appToken = await signInWithGoogle(providerToken, () => {});
        if (!appToken) {
          throw new Error("Could not complete application sign in.");
        }

        signIn(appToken, true);

        const redirectPath = await getPostLoginRedirectPath(appToken, () => {});

        // We only use Supabase to complete OAuth, then rely on app JWT.
        await supabase.auth.signOut();

        router.replace(redirectPath);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Google sign in failed.",
        );
      }
    };

    finishGoogleSignIn();
  }, [router, signIn]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace("/signin");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [errorMessage, router]);

  if (!errorMessage) {
    // Keep callback UX silent while we exchange tokens and redirect.
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6">
        <h1 className="text-lg font-semibold text-gray-900">Sign in failed</h1>
        <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        <p className="mt-3 text-xs text-gray-500">
          Redirecting you back to sign in...
        </p>
      </div>
    </main>
  );
}
