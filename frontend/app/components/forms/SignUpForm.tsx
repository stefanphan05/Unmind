import { EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export function SignUpForm() {
  return (
    <div className="max-w-lg w-full space-y-8">
      {/* -----------------Header----------------- */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Create an account
        </h1>
      </div>

      {/* -----------------Form----------------- */}
      <div className="space-y-6">
        {/* -----------------Email Field----------------- */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm text-gray-700 mb-2 font-semibold"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@work-email.com"
            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* -----------------Username Field----------------- */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm text-gray-700 mb-2 font-semibold"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="username"
            placeholder="username"
            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* -----------------Password Field----------------- */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-700 mb-2 font-semibold"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••• ••••• ••••••••• •••••••"
              className="w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* -----------------Continue Button----------------- */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-semibold text-white bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Continue ▶
        </button>

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
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
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
          Sign up with Google
        </button>

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
      </div>
    </div>
  );
}
