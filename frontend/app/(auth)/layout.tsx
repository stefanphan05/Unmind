import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src={"/images/unmind-logo.png"}
        alt="Logo"
        width={130}
        height={20}
        className="absolute top-5 left-5"
      />
      {children}
    </div>
  );
}
