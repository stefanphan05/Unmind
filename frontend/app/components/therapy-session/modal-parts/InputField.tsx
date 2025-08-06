interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-5 text-sm input-field placeholder-gray-500 focus:outline-none rounded-2xl"
      />
    </div>
  );
}
