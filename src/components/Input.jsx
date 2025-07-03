"use client";
import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className,
  rightIcon = null, // NEW PROP
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-md md:text-xl text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`w-full px-4 py-3 pr-10 border rounded-md focus:outline-none focus:ring-1 ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          } ${className}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? (
              <IoEyeOutline size={20} className="cursor-pointer" />
            ) : (
              <IoEyeOffOutline size={20} className="cursor-pointer" />
            )}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        ) : null}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
