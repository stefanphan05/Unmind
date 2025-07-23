interface AuthFormTitleProps {
  title: string;
}

export default function AuthFormTitle({ title }: AuthFormTitleProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
    </div>
  );
}
