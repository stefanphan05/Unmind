interface SubmitButtonProps {
  label: string;
}

export default function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl text-sm text-white bg-black hover:bg-gray-800 transition cursor-pointer"
    >
      {label}
    </button>
  );
}
