interface AuthFormTitleProps {
  title: string;
}

export default function AuthFormTitle({ title }: AuthFormTitleProps) {
  return (
    <h1 className="auth-form-title font-display">{title}</h1>
  );
}
