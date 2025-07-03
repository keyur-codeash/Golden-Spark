import React from "react";
import Heading from "./Heading";

function HeroSectionCommon({ heading }) {
  return (
    <div className="relative w-full py-20 md:py-24 lg:py-26">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/hero-common-bg.png')] bg-cover bg-center z-0" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black-100 opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <Heading color="text-white" className="!font-bold">
          {heading}
        </Heading>
      </div>
    </div>
  );
}

export default HeroSectionCommon;
