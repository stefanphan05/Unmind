"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { SignInPayload, signInUser } from "@/lib/api/auth";

import ErrorModal from "../modals/ErrorModal";

import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useRouter } from "next/navigation";
import AuthInput from "../auth/AuthInput";
import PasswordInputWithToggle from "../auth/PasswordInputWithToggle";
import ContinueButton from "../auth/ContinueButton";

export function SignInForm() {
  const router = useRouter();

  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

    // Send sign-up request and let the API handle validation or errors, get back the token
    const token = await signInUser(payload, handleError);

    // Save to localStorage
    localStorage.setItem("authToken", token);

    // If the request is successful, show the success modal
    router.push("/chat");
  };

  return (
    <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg space-y-8">
      {/* -----------------Header----------------- */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Unmind
        </h1>
      </div>

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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* -----------------Google Login Button----------------- */}
        <button
          type="button"
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500  cursor-pointer"
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
          Sign in with Google
        </button>

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
