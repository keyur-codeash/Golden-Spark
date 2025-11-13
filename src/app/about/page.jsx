"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import AboutDetails from "./component/AboutDetails";
import DesignInnovationJourney from "./component/DesignInnovationJourney";
import BehindTheBrands from "./component/BehindTheBrands";
import Instagram from "@/components/home/Instagram";

const Page = () => {
  return (
    <div>
      <div>
        <HeroSectionCommon heading="About" />
      </div>
      <div className="space-y-12">
        <AboutDetails />
        <DesignInnovationJourney />
        <BehindTheBrands />
        <Instagram />
      </div>
    </div>
  );
};

export default Page;
