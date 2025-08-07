interface AuthFormTitleProps {
  title: string;
}

export default function AuthFormTitle({ title }: AuthFormTitleProps) {
  return (
    <div>
      <h1 className="text-5xl font-semibold text-gray-900 text-center mb-8">
        {title}
      </h1>
    </div>
  );
}
