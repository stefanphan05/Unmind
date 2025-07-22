interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm text-gray-700 mb-2 font-semibold"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
    </div>
  );
}
