export default function GlassContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-lg overflow-hidden text-[#675f5f] ">
      {children}
    </div>
  );
}
