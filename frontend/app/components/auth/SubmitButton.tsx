interface SubmitButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function SubmitButton({
  label,
  isLoading = false,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl text-sm text-white bg-black  transition${
        isLoading || disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
      }`}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {label}
    </button>
  );
}
