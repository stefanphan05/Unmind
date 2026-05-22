interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export default function ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  hasError,
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
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
    </div>
  );
}
