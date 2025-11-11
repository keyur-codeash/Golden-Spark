import React from "react";
import Heading from "./Heading";
import Link from "next/link";

const HeroSectionCommon = ({ heading }) => {
  return (
    <div className="relative w-full py-20 md:py-24 lg:py-26">
      <div className="absolute inset-0 bg-[url('/images/hero-common-bg.png')] bg-cover bg-center z-0" />

      <div className="absolute inset-0 bg-black-100 opacity-50 z-10" />

      <div className="relative z-20 flex items-center justify-center h-full">
        <Heading color="text-white" className="!font-bold">
          <Link href="/">Home/</Link>
          {heading}
        </Heading>
      </div>
    </div>
  );
};

export default HeroSectionCommon;
