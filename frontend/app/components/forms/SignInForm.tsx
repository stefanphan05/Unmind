"use client";

import Link from "next/link";
import React, { useState } from "react";

import { SignInPayload, signInUser } from "@/lib/api/auth";

import ErrorModal from "../modals/ErrorModal";

import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useRouter } from "next/navigation";
import AuthInput from "../auth/AuthInput";
import PasswordInputWithToggle from "../auth/PasswordInputWithToggle";
import ContinueButton from "../auth/ContinueButton";
import { useAuth } from "@/context/AuthContext";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import AuthDivider from "../auth/AuthDivider";
import AuthFormTitle from "../auth/AuthFormTitle";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);

  // ------------------ Handlers ------------------
  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ Form Submission ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    // Track which fields are missing
    const missingFields = [];

    // Validate each field and collect missing ones
    if (!email.trim()) missingFields.push("Email");
    if (!password.trim()) missingFields.push("Password");

    // If there are any missing fields, show an error message and stop the form submission
    if (missingFields.length > 0) {
      handleError({
        name: "Missing fields",
        statusCode: 400,
        message: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required.`,
      });
      return;
    }

    // Prepare the data to be sent to the API
    const payload: SignInPayload = {
      email,
      password,
    };

    try {
      // Get token from API
      const token = await signInUser(payload, handleError);

      console.log("Received token:", token);

      if (token) {
        // Use context to sign in (this will update the header automatically!)
        signIn(token, isRememberMe);

        // Go to chat page
        router.push("/chat");
      }
    } catch (error) {
      handleError({
        name: "Signin Errors",
        statusCode: 400,
        message: `Sign in failed:" ${error}`,
      });
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg space-y-8">
      {/* -----------------Header----------------- */}
      <AuthFormTitle title="Welcome to Unmind" />

      {/* -----------------Form----------------- */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* -----------------Email Field----------------- */}
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@work-email.com"
        />

        {/* -----------------Password Field----------------- */}
        <PasswordInputWithToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
              className="h-4 w-4 accent-cyan-400 focus:ring-cyan-500 border-gray-300"
            />
            <label
              htmlFor="remember-me"
              className="ml-4 block text-sm text-gray-700"
            >
              Remember Me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-cyan-500 hover:text-cyan-600">
              Forgot password?
            </a>
          </div>
        </div>

        {/* -----------------Continue Button----------------- */}
        <ContinueButton />

        {/* -----------------Divider----------------- */}
        <AuthDivider />

        {/* -----------------Google Login Button----------------- */}
        <GoogleAuthButton label="Sign in with Google" />

        {/* -----------------Create Account Link----------------- */}
        <p className="text-center text-sm text-gray-600">
          Not using Unmind yet?{" "}
          <Link
            href="signup"
            className="text-cyan-500 hover:text-cyan-600 font-semibold"
          >
            Create an account now
          </Link>
        </p>
      </form>

      {/* -----------------Modals----------------- */}
      <div className="h-0">
        <ErrorModal error={error} onClose={closeErrorModal} />
      </div>
    </div>
  );
}
