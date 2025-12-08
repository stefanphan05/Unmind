// components/ui/LoadingOverlay.tsx

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  spinnerSize?: "sm" | "md" | "lg";
}

export default function LoadingOverlay({
  isVisible,
  message = "Loading...",
  spinnerSize = "md",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${sizeClasses[spinnerSize]} border-gray-200 border-t-gray-800 rounded-full animate-spin`}
        />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
