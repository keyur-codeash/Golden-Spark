"use client";
import { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth,
  closeIcon,
  maxHeight,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup on unmount or modal close
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50 h-screen">
      <div
        className={`bg-white rounded-lg w-full lg:w-1/2  ${
          maxHeight ? maxHeight : "max-h-[90vh]"
        } ${maxWidth} overflow-y-auto`}
      >
        <div className="relative py-10">
          {closeIcon != false && (
            <button
              onClick={onClose}
              className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
