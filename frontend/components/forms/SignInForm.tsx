"use client";

import Link from "next/link";
import React, { useState } from "react";

import { SignInPayload, signInUser } from "@/lib/api/auth";

import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { getPostLoginRedirectPath } from "@/lib/utils/getPostLoginRedirectPath";

import { getMissingFields } from "@/lib/utils/getMissingAuthFields";

import { AuthFormLayout } from "./AuthFormLayout";
import { useAuth } from "@/providers/auth-provider";

import AuthDivider from "../features/auth/AuthDivider";
import GoogleAuthButton from "../features/auth/GoogleAuthButton";
import PasswordInputWithToggle from "../features/auth/PasswordInputWithToggle";
import SubmitButton from "../features/auth/SubmitButton";

import InputWithLabel from "../ui/InputWithLabel";
import LoadingOverlay from "../ui/LoadingOverlay";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // ------------------ Handlers ------------------
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

    // Start loading
    setIsLoading(true);

    try {
      // Prepare the data to be sent to the API
      const payload: SignInPayload = {
        email,
        password,
      };

      // Get token from API
      const token = await signInUser(payload, handleError);

      if (token) {
        // Use context to sign in (this will update the header automatically!)
        signIn(token, isRememberMe);

        // Show navigating state for smooth transition
        setIsNavigating(true);

        // Small delay for smooth visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300));

        const redirectPath = await getPostLoginRedirectPath(token, handleError);
        router.push(redirectPath);
      }
    } catch (error) {
      console.log("Sign in error", error);
    } finally {
      if (!isNavigating) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={isNavigating} message="" />

      <AuthFormLayout
        title="Sign in"
        onSubmit={handleSubmit}
        error={error}
        onCloseError={closeErrorModal}
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

        {/* -----------------Password Field----------------- */}
        <PasswordInputWithToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {/* --------------Remember Me and Forgot Password------------- */}
        <div className="auth-remember-row">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={isRememberMe}
              onChange={(e) => setIsRememberMe(e.target.checked)}
              className="auth-checkbox"
              disabled={isLoading}
            />
            <label
              htmlFor="remember-me"
              className={`auth-checkbox-label ${
                isLoading ? "auth-checkbox-label--disabled" : ""
              }`}
            >
              Remember Me
            </label>
          </div>
          <a
            href="/forgot-password"
            className={`auth-aux-link ${
              isLoading ? "auth-aux-link--disabled" : ""
            }`}
          >
            Forgot password?
          </a>
        </div>

        {/* -----------------Submit Button----------------- */}
        <SubmitButton
          label={isLoading ? "Signing in..." : "Sign in"}
          isLoading={isLoading}
        />

        {/* -----------------Divider----------------- */}
        <AuthDivider />

        {/* -----------------Google Login Button----------------- */}
        <GoogleAuthButton
          label="Sign in with Google"
          isLoading={isLoading}
          onNavigating={setIsNavigating}
        />

        {/* -----------------Create Account Link----------------- */}
        <p className="auth-footer-text">
          Not using Unmind yet?{" "}
          <Link
            href="signup"
            className={`auth-switch-link ${
              isLoading ? "auth-switch-link--disabled" : ""
            }`}
          >
            Create an account now
          </Link>
        </p>
      </AuthFormLayout>
    </>
  );
}
