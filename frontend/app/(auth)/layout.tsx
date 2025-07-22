export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      {children}
    </div>
  );
}
