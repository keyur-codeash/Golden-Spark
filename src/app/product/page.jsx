"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React from "react";
import ResponsiveFilter from "./components/ResponsiveFilter";
import "aos/dist/aos.css";

function page() {
  return (
    <>
      <HeroSectionCommon heading="Home/Product" />
      <div className="container mx-auto">
        <ResponsiveFilter />
      </div>
    </>
  );
}

export default page;
