"use client";

interface AlertBannerProps {
  variant?: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
  onClose?: () => void;
}

export function AlertBanner({ variant = "info", children, onClose }: AlertBannerProps) {
  const variants = {
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    error: "bg-red-50 text-red-900 border-red-200",
  };

  return (
    <div className={`p-4 border rounded-lg ${variants[variant]} flex items-center justify-between`} role="alert">
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-current hover:opacity-70" aria-label="Close alert">
          ×
        </button>
      )}
    </div>
  );
}

