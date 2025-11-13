"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import ShopByCollection from "@/components/home/ShopByCollection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PerfectChoice from "@/components/home/PerfectChoice";
import BrowseLatestArrivals from "@/components/home/BrowseLatestArrivals";
import Faq from "@/components/home/Faq";
import ForThePeople from "@/components/home/ForThePeople";
import FavoriteProducts from "@/components/home/FavoriteProducts";
import OurJournals from "@/components/home/OurJournals";
import Instagram from "@/components/home/Instagram";
import LoadingSpinner from "@/components/LoadingSpinner";
import AOS from "aos";
import "./globals.css";
import "aos/dist/aos.css";
import useToken from "@/forntend/hooks/useToken";

export default function Home() {
  const [loadingImages, setLoadingImages] = useState(true);
  const { token } = useToken();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const images = Array.from(document.images);
    const total = images.length;
    let loaded = 0;
    
    if (total === 0) {
      setLoadingImages(false);
      return;
    }

    const onImageLoad = () => {
      loaded++;
      if (loaded === total) {
        setLoadingImages(false);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        onImageLoad();
      } else {
        img.addEventListener("load", onImageLoad);
        img.addEventListener("error", onImageLoad);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", onImageLoad);
        img.removeEventListener("error", onImageLoad);
      });
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {loadingImages && <LoadingSpinner />}
      {!loadingImages && (
        <>
          <HeroSection />
          <ShopByCollection />
          <PerfectChoice />
          <div>
            <BrowseLatestArrivals />
          </div>
          <Faq />
          <ForThePeople />
          {token && <FavoriteProducts />}
          <OurJournals />
          <Instagram />
        </>
      )}
    </div>
  );
}
