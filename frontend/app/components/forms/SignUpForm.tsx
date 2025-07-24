"use client";
import Link from "next/link";
import React, { useState } from "react";

import { SignUpPayload, signUpUser } from "@/lib/api/auth";

import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useSuccessHandler } from "@/hooks/useSuccessHandler";

import { getMissingFields } from "@/utils/getMissingAuthFields";

import { AuthFormLayout } from "./AuthFormLayout";

import AuthInput from "../auth/AuthInput";
import PasswordInputWithToggle from "../auth/PasswordInputWithToggle";
import AuthDivider from "../auth/AuthDivider";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import SubmitButton from "../auth/SubmitButton";

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

    // Get the result from signUpUser
    const result = await signUpUser(payload, handleError);

    // Only show success modal if signup was actually successful
    if (result) {
      openSuccessModal();
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

      {/* -----------------Submit Button----------------- */}
      <SubmitButton label="Sign up" />

      {/* -----------------Divider----------------- */}
      <AuthDivider />

      {/* -----------------Google Login Button----------------- */}
      <GoogleAuthButton label="Sign up with Google" />

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
