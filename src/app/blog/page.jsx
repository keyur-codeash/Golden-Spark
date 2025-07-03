"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect } from "react";
import LatestArticle from "./component/LatestArticle";
import MoreBlog from "./component/MoreBlog";
import "aos/dist/aos.css";
import AOS from "aos";

function page() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  return (
    <div className="blog">
      <div className="container mx-auto">
        <LatestArticle />{" "}
        <div data-aos="fade-down">
          <MoreBlog />
        </div>
      </div>
    </div>
  );
}

export default page;
