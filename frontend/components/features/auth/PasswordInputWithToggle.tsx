"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface PasswordInputWithToggleProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export default function PasswordInputWithToggle({
  value,
  onChange,
  disabled,
  hasError,
}: PasswordInputWithToggleProps) {
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  return (
    <div>
      <label htmlFor="password" className="auth-label">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={isShowingPassword ? "text" : "password"}
          placeholder="••••••• ••••• ••••••••• •••••••"
          value={value}
          onChange={onChange}
          className={`auth-input pr-11 ${hasError ? "auth-input--error" : ""}`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setIsShowingPassword(!isShowingPassword)}
          className="auth-toggle-btn"
          disabled={disabled}
          aria-label={isShowingPassword ? "Hide password" : "Show password"}
        >
          {isShowingPassword ? (
            <EyeOffIcon className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <EyeIcon className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}
