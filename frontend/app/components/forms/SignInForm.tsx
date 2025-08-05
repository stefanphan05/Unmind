"use client";

import Link from "next/link";
import React, { useState } from "react";

import { SignInPayload, signInUser } from "@/lib/api/auth";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

import { getMissingFields } from "@/utils/getMissingAuthFields";

import AuthInput from "../auth/AuthInput";
import PasswordInputWithToggle from "../auth/PasswordInputWithToggle";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import AuthDivider from "../auth/AuthDivider";
import { AuthFormLayout } from "./AuthFormLayout";
import SubmitButton from "../auth/SubmitButton";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        // Go to chat page
        router.push("/chat");
      }
    } catch (error) {
      console.log("Sign in error", error);
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Sign in"
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
        disabled={isLoading}
      />

      {/* -----------------Password Field----------------- */}
      <PasswordInputWithToggle
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      {/* --------------Remember Me and Forgot Password------------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={isRememberMe}
            onChange={(e) => setIsRememberMe(e.target.checked)}
            className="h-4 w-4 accent-gray-700 border-gray-300"
            disabled={isLoading}
          />
          <label
            htmlFor="remember-me"
            className={`ml-4 block text-sm ${
              isLoading ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Remember Me
          </label>
        </div>
        <div className="text-sm">
          <a
            href="/forgot-password"
            className={`${
              isLoading
                ? "text-gray-400 pointer-events-none"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* -----------------Submit Button----------------- */}
      <SubmitButton
        label={isLoading ? "Signing in..." : "Sign in"}
        isLoading={isLoading}
      />

      {/* -----------------Divider----------------- */}
      <AuthDivider />

      {/* -----------------Google Login Button----------------- */}
      <GoogleAuthButton label="Sign in with Google" />

      {/* -----------------Create Account Link----------------- */}
      <p className="text-center text-sm">
        Not using Unmind yet?{" "}
        <Link
          href="signup"
          className={`font-semibold transition ${
            isLoading
              ? "text-gray-400 pointer-events-none"
              : "text-black hover:text-gray-700"
          }`}
        >
          Create an account now
        </Link>
      </p>
    </AuthFormLayout>
  );
}
