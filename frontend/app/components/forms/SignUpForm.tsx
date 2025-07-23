"use client";
import Link from "next/link";
import { SignUpPayload, signUpUser } from "@/lib/api/auth";
import React, { useState } from "react";

import ErrorModal from "../modals/ErrorModal";
import SuccessModal from "../modals/SuccessModal";

import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useSuccessHandler } from "@/hooks/useSuccessHandler";
import AuthInput from "../auth/AuthInput";
import PasswordInputWithToggle from "../auth/PasswordInputWithToggle";
import ContinueButton from "../auth/ContinueButton";
import AuthDivider from "../auth/AuthDivider";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import AuthFormTitle from "../auth/AuthFormTitle";

export function SignUpForm() {
  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ------------------ Handlers ------------------
  const { showSuccess, openSuccessModal, closeSuccessModal } =
    useSuccessHandler("/signin");
  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ Form Submission ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    // Track which fields are missing
    const missingFields = [];

    // Validate each field and collect missing ones
    if (!email.trim()) missingFields.push("Email");
    if (!username.trim()) missingFields.push("Username");
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
    const payload: SignUpPayload = {
      email,
      username,
      password,
    };

    // Send sign-up request and let the API handle validation or errors
    await signUpUser(payload, handleError);

    // If the request is successful, show the success modal
    openSuccessModal();
  };

  return (
    <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg space-y-8">
      {/* -----------------Header----------------- */}
      <AuthFormTitle title="Create an account" />

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

        {/* -----------------Username Field----------------- */}
        <AuthInput
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Tony"
        />

        {/* -----------------Password Field----------------- */}
        <PasswordInputWithToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* -----------------Continue Button----------------- */}
        <ContinueButton />

        {/* -----------------Divider----------------- */}
        <AuthDivider />

        {/* -----------------Google Login Button----------------- */}
        <GoogleAuthButton label="Sign up with Google" />

        {/* -----------------Create Account Link----------------- */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="signin"
            className="text-cyan-500 hover:text-cyan-600 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </form>

      {/* -----------------Modals----------------- */}
      <div className="h-0">
        <ErrorModal error={error} onClose={closeErrorModal} />
        <SuccessModal
          isOpen={showSuccess}
          onClose={closeSuccessModal}
          title="Welcome aboard!"
          message="Your account has been created successfully. You can now sign in to access your dashboard."
        />
      </div>
    </div>
  );
}
