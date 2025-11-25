"use client";
import { useEffect } from "react";

const CommonModel = ({
  isOpen,
  onClose,
  children,
  maxWidth,
  closeIcon,
  maxHeight,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50 h-screen">
      <div
        className={`bg-white rounded-lg w-full lg:w-1/2 ${
          maxHeight ? maxHeight : "max-h-[90vh] overflow-y-auto"
        } ${maxWidth}`}
      >
        <div>
          <div className="relative">
            {closeIcon != false && (
              <div clsassName="fixed left-0 right-10 top-[27px] w-1/2 mx-auto max-h-[90vh] bg-blue-500">
                <button
                  onClick={onClose}
                  className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModel;