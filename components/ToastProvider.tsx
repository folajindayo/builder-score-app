"use client";

import { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/lib/use-toast";
import { ToastContainer } from "@/components/Toast";

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
}

