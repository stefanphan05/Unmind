"use client";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { AuthFormLayout } from "./AuthFormLayout";
import AuthInput from "../auth/AuthInput";
import { useState } from "react";
import AuthDivider from "../auth/AuthDivider";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import Link from "next/link";
import { getMissingFields } from "@/utils/getMissingAuthFields";
import { requestPasswordReset } from "@/lib/api/request-password-reset";
import SubmitButton from "../auth/SubmitButton";

export function ForgotPasswordForm() {
  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");

  // ------------------ Handlers ------------------
  const { error, handleError, closeErrorModal } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    // Check all fields
    const errorMessage = getMissingFields([["Email", email]]);

    if (errorMessage) {
      handleError({
        name: "Missing fields",
        statusCode: 400,
        message: errorMessage,
      });
      return;
    }

    await requestPasswordReset(email, handleError);
  };
  return (
    <AuthFormLayout
      title="Forgot password?"
      onSubmit={handleSubmit}
      error={error}
      onCloseError={closeErrorModal}
    >
      {/* -----------------Email Field----------------- */}
      <AuthInput
        id="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@work-email.com"
      />

      {/* -----------------Submit Button----------------- */}
      <SubmitButton label="Reset your password" />

      {/* -----------------Divider----------------- */}
      <AuthDivider />

      {/* -----------------Google Login Button----------------- */}
      <GoogleAuthButton label="Sign in with Google" />

      {/* -----------------Create Account Link----------------- */}
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="signin"
          className="text-black hover:text-gray-700 font-semibold transition"
        >
          Sign in
        </Link>
      </p>
    </AuthFormLayout>
  );
}
