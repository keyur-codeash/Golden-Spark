"use client";
import React from "react";
import clsx from "clsx";

export default function Button({
  label,
  variant = "solid",
  size = "md", 
  color = "blue",
  icon = null,
  type = "button",
  onClick,
  className = "",
  disabled
  
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition duration-200 text-nowrap";

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  const variants = {
    solid: `bg-${color}-600 text-white hover:bg-${color}-700`,
    outline: `border border-${color}-600 text-${color}-600 hover:bg-${color}-50`,
    ghost: `text-${color}-600 hover:bg-${color}-50`,
  };

  const classes = clsx(
    base,
    sizes[size],
    variants[variant],
    className,
    "cursor-pointer"
  );

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled ? disabled : false}>
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
