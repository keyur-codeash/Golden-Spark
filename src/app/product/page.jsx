"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import ResponsiveFilter from "./components/ResponsiveFilter";
import AOS from "aos";
import "aos/dist/aos.css";

const page = () => {
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <div data-aos="fade-up">
        <HeroSectionCommon heading="Product" />
      </div>  

      <div className="container mx-auto">
        <ResponsiveFilter />
      </div>
    </>
  );
}

export default page;
