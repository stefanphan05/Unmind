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
import { AuthFormLayout } from "./AuthFormLayout";
import { getMissingFields } from "@/utils/getMissingAuthFields";

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
      title="Create an account"
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
    </AuthFormLayout>
  );
}
