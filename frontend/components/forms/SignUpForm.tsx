"use client";
import Link from "next/link";
import React, { useState } from "react";

import { SignUpPayload, signUpUser } from "@/lib/api/auth";

import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useSuccessHandler } from "@/lib/hooks/useSuccessHandler";

import { getMissingFields } from "@/lib/utils/getMissingAuthFields";

import { AuthFormLayout } from "./AuthFormLayout";

import AuthDivider from "../features/auth/AuthDivider";
import AuthInput from "../features/auth/AuthInput";
import GoogleAuthButton from "../features/auth/GoogleAuthButton";
import PasswordInputWithToggle from "../features/auth/PasswordInputWithToggle";
import SubmitButton from "../features/auth/SubmitButton";

import InputWithLabel from "../ui/InputWithLabel";
import LoadingOverlay from "../ui/LoadingOverlay";

export function SignUpForm() {
  const router = useRouter();

  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // ------------------ Handlers ------------------
  const { showSuccess, openSuccessModal, closeSuccessModal } =
    useSuccessHandler("/signin");
  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ Form Submission ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    // Do not submit if already loading
    if (isLoading) return;

    // Check all fields
    const errorMessage = getMissingFields([
      ["Email", email],
      ["Username", username],
      ["Password", password],
    ]);

    if (errorMessage) {
      handleError({
        name: "Missing fields",
        statusCode: 400,
        message: errorMessage,
      });
      return;
    }

    // Prepare the data to be sent to the API
    const payload: SignUpPayload = {
      email,
      username,
      password,
    };

    // Start loading
    setIsLoading(true);

    try {
      // Get the result from signUpUser
      const result = await signUpUser(payload, handleError);

      // Only show success modal if signup was actually successful
      if (result) {
        // Show navigating state for smooth transition
        setIsNavigating(true);

        // Small delay for smooth visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Reset navigating state after modal opens
        setIsNavigating(false);

        openSuccessModal();
      }
    } catch (error) {
      console.log("Sign up error", error);
    } finally {
      if (!isNavigating) {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthFormLayout
      title="Sign up"
      onSubmit={handleSubmit}
      error={error}
      onCloseError={closeErrorModal}
      successModal={{
        isOpen: showSuccess,
        onClose: closeSuccessModal,
        title: "Welcome aboard!",
        message:
          "Your account has been created successfully. You can now sign in to access your dashboard.",
      }}
    >
      {/* -----------------Email Field----------------- */}
      <InputWithLabel
        id="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@work-email.com"
        disabled={isLoading}
      />

      {/* -----------------Username Field----------------- */}
      <InputWithLabel
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Tony"
        disabled={isLoading}
      />

      {/* -----------------Password Field----------------- */}
      <PasswordInputWithToggle
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      {/* -----------------Submit Button----------------- */}
      <SubmitButton
        label={isLoading ? "Signing up..." : "Sign up"}
        isLoading={isLoading}
      />

      {/* -----------------Divider----------------- */}
      <AuthDivider />

      {/* -----------------Google Login Button----------------- */}
      <GoogleAuthButton
        label="Sign up with Google"
        isLoading={isLoading}
        onNavigating={setIsNavigating}
      />

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

      <LoadingOverlay
        isVisible={isNavigating}
        message="Redirecting to your chat..."
      />
    </AuthFormLayout>
  );
}
