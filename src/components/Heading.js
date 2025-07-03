"use client";
import React from "react";

function Heading({
  children,
  color = "text-black",
  size = "text-[48px]",
  align = "text-center",
  className,
}) {
  return (
    <h1
      className={`font-frank text-2xl sm:text-4xl md:text-[48px] font-medium leading-none sm:px-10 md:${size} ${color} ${align} ${className}`}
    >
      {children}
    </h1>
  );
}

export default Heading;