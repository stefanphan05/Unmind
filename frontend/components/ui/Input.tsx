interface InputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export default function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  hasError,
}: InputProps) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`auth-input ${hasError ? "auth-input--error" : ""}`}
      disabled={disabled}
    />
  );
}
