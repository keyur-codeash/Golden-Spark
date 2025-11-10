"use client";
import { Toaster } from "sonner";

export default ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      richColors
      duration={2000}
      visibleToasts={1}
    />
  );
}
