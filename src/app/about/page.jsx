"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import AboutDetails from "./component/AboutDetails";
import DesignInnovationJourney from "./component/DesignInnovationJourney";
import BehindTheBrands from "./component/BehindTheBrands";
import Instagram from "@/components/home/Instagram";
import AOS from "aos";
import "aos/dist/aos.css";

function Page() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <div data-aos="fade-up">
        <HeroSectionCommon heading="Home/About" />
      </div>
      <div className="container mx-auto space-y-12">
        <div data-aos="fade-up">
          <AboutDetails />
        </div>

        <div data-aos="fade-right">
          <DesignInnovationJourney />
        </div>

        <div data-aos="fade-left">
          <BehindTheBrands />
        </div>

        <div data-aos="zoom-in">
          <Instagram />
        </div>
      </div>
    </div>
  );
}

export default Page;
