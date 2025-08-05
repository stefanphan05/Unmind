"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface PasswordInputWithToggleProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function PasswordInputWithToggle({
  value,
  onChange,
  disabled,
}: PasswordInputWithToggleProps) {
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  return (
    <div>
      <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
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
          className="w-full px-3 py-4 input-field placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-2xl pr-10"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setIsShowingPassword(!isShowingPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        >
          {isShowingPassword ? (
            <EyeOffIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}
