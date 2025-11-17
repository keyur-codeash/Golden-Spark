"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import GethInThouch from "./component/GetInTouch";
import Map from "./component/Map";

function page() {
  
  return (
    <>
      <HeroSectionCommon heading="Contact" />
      <div data-aos="fade-up">
        <div className="container mx-auto"></div>
        <GethInThouch />
        <Map />
      </div>
    </>
  );
}

export default page;
