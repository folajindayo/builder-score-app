"use client";

import { IconButton } from "@/components/IconButton";

interface DownloadButtonProps {
  data: string | Blob;
  filename: string;
  mimeType?: string;
  label?: string;
  className?: string;
}

export function DownloadButton({
  data,
  filename,
  mimeType = "application/json",
  label = "Download",
  className = "",
}: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = typeof data === "string" ? new Blob([data], { type: mimeType }) : data;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <IconButton
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      }
      label={label}
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      className={className}
    />
  );
}

