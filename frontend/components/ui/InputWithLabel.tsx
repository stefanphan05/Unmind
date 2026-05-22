import Input from "./Input";

interface InputWithLabelProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export default function InputWithLabel({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  hasError,
}: InputWithLabelProps) {
  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        hasError={hasError}
      />
    </div>
  );
}
