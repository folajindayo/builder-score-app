"use client";

import { ReactNode, FormEvent } from "react";

interface FormProps {
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function Form({
  children,
  onSubmit,
  className = "",
}: FormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}

