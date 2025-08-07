interface InputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: InputProps) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-4 input-field placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-2xl"
      disabled={disabled}
    />
  );
}
