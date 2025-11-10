"use client";
import { useState, useEffect } from "react";
import {
  productDetails,
} from "@/data/data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SupremeQuality from "../../components/SupremeQuality";
import YouMightAlsoLike from "../../components/YouMightAlsoLike";

export default function ProductClient({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  const openModal = (index = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productDetails.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productDetails.length - 1 ? 0 : prev + 1
    );
  };

  const handleSizeSelect = (size) => setSelectedSize(size);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
    ),
  };

  return (
    <>
      <SupremeQuality />
      <YouMightAlsoLike />
    </>
  );
}
