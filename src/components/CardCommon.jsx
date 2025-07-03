import React from "react";

const CardCommon = ({ image, text, className = "" }) => {
  return (
    <div className={`px-3 xl:px-7 ${className}`}>
      <div className="h-[246px]">
        <img
          src={image}
          alt={text}
          className="object-cover w-full h-full rounded-full border-6 border-brown-900"
        />
      </div>
      <p className="text-center py-4 text-xl xl:text-2xl">{text}</p>
    </div>
  );
};

export default CardCommon;