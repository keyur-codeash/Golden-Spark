"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import ResponsiveFilter from "./components/ResponsiveFilter";

const page = () => {

  return (
    <>
       <HeroSectionCommon heading="Product" />
      <div className="container mx-auto">
        <ResponsiveFilter />
      </div>
    </>
  );
}

export default page;
