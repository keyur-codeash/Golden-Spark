"use client"
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import GethInThouch from "./component/GetInTouch";
import Map from "./component/Map";
  import AOS from "aos";
import "aos/dist/aos.css";

function page() {
    useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  
  return (
<div data-aos="fade-up">
      <HeroSectionCommon heading="Home/Contact" />
      <div className="container mx-auto">
      </div>
      <GethInThouch />
      <Map />
    </div>
  );
}

export default page;
