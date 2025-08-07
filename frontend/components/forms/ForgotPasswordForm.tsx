"use client";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { AuthFormLayout } from "./AuthFormLayout";
import { useState } from "react";

import Link from "next/link";
import { getMissingFields } from "@/lib/utils/getMissingAuthFields";
import {
  requestPasswordReset,
  resetPassword,
  verifyResetCode,
} from "@/lib/api/forgot-password";
import { useSuccessHandler } from "@/lib/hooks/useSuccessHandler";
import AuthDivider from "../features/auth/AuthDivider";
import AuthInput from "../features/auth/AuthInput";
import GoogleAuthButton from "../features/auth/GoogleAuthButton";
import SubmitButton from "../features/auth/SubmitButton";

type Step = "email" | "code" | "newPassword";

export function ForgotPasswordForm() {
  // ------------------ States ------------------
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [resetToken, setResetToken] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showSuccess, openSuccessModal, closeSuccessModal } =
    useSuccessHandler("/signin");

  // ------------------ Handlers ------------------
  const { error, handleError, closeErrorModal } = useErrorHandler();

  const handleEmailSubmit = async () => {
    // Check email field
    const errorMessage = getMissingFields([["Email", email]]);

    if (errorMessage) {
      handleError({
        name: "Missing fields",
        statusCode: 400,
        message: errorMessage,
      });
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset(email, handleError);
      setCurrentStep("code");
    } catch (error) {
      console.log("Email submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    // Check code field
    const errorMessage = getMissingFields([["Code", code]]);

    if (errorMessage) {
      handleError({
        name: "Missing fields",
        statusCode: 400,
        message: errorMessage,
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = await verifyResetCode(code, email, handleError);

      setResetToken(token);
      setCurrentStep("newPassword");
    } catch (error) {
      console.log("Email submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    // Check password fields
    const errorMessage = getMissingFields([
      ["New Password", newPassword],
      ["Confirm Password", confirmPassword],
    ]);

    if (errorMessage) {
      handleError({
        name: "Missing fields",
        statusCode: 400,
        message: errorMessage,
      });
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      handleError({
        name: "Password mismatch",
        statusCode: 400,
        message: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(resetToken, newPassword, handleError);
      openSuccessModal();
    } catch (error) {
      console.log("Email submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    // Do not submit if already loading
    if (isLoading) return;

    switch (currentStep) {
      case "email":
        await handleEmailSubmit();
        break;
      case "code":
        await handleCodeSubmit();
        break;
      case "newPassword":
        await handlePasswordReset();
        break;
    }
  };

  const getTitle = () => {
    switch (currentStep) {
      case "email":
        return "Forgot password?";
      case "code":
        return "Enter verification code";
      case "newPassword":
        return "Reset your password";
      default:
        return "Forgot password?";
    }
  };

  const getSubmitLabel = () => {
    if (isLoading) {
      switch (currentStep) {
        case "email":
          return "Sending Code...";
        case "code":
          return "Verifying...";
        case "newPassword":
          return "Resetting Password...";
        default:
          return "Loading...";
      }
    }

    switch (currentStep) {
      case "email":
        return "Send Code";
      case "code":
        return "Verify Code";
      case "newPassword":
        return "Reset Password";
      default:
        return "Continue";
    }
  };

  return (
    <AuthFormLayout
      title={getTitle()}
      onSubmit={handleSubmit}
      error={error}
      onCloseError={closeErrorModal}
      successModal={{
        isOpen: showSuccess,
        onClose: closeSuccessModal,
        title: "Password Reset Successful!",
        message:
          "Your password has been updated successfully. You can now sign in with your new password.",
      }}
    >
      {/* -----------------Email Field----------------- */}
      {currentStep === "email" && (
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@work-email.com"
          disabled={isLoading}
        />
      )}

      {/* -----------------Code Field----------------- */}
      {currentStep === "code" && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            We've sent a verification code to <strong>{email}</strong>
          </p>
          <AuthInput
            id="code"
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="******"
            disabled={isLoading}
          />
        </>
      )}

      {/* -----------------New Password Fields----------------- */}
      {currentStep === "newPassword" && (
        <>
          <AuthInput
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            disabled={isLoading}
          />
          <AuthInput
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            disabled={isLoading}
          />
        </>
      )}

      {/* -----------------Submit Button----------------- */}
      <SubmitButton label={getSubmitLabel()} isLoading={isLoading} />

      {/* -----------------Divider----------------- */}
      <AuthDivider />

      {/* -----------------Google Login Button----------------- */}

      <GoogleAuthButton label="Sign in with Google" isLoading={isLoading} />

      {/* -----------------Links----------------- */}
      {currentStep === "email" && (
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="signin"
            className={`font-semibold transition ${
              isLoading
                ? "text-gray-400 pointer-events-none"
                : "text-black hover:text-gray-700"
            }`}
          >
            Sign in
          </Link>
        </p>
      )}

      {/* -----------------Back to Email Link----------------- */}
      {currentStep === "code" && (
        <p className="text-center text-sm">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => setCurrentStep("email")}
            disabled={isLoading}
            className={`font-semibold transition ${
              isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-black hover:text-gray-700"
            }`}
          >
            Try again
          </button>
        </p>
      )}
    </AuthFormLayout>
  );
}
