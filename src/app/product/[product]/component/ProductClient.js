"use client";
import { useState, useEffect } from "react";
import {
  productDetails,
  productAccoudianData,
} from "@/data/data";
import Image from "next/image";
import { HiOutlineX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import Button from "@/components/Button";
import Accordion from "@/components/Accordion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { redirect } from "next/navigation";
import SupremeQuality from "../../components/SupremeQuality";
import YouMightAlsoLike from "../../components/YouMightAlsoLike";

export default function ProductClient({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [color, setColor] = useState("Gold");
  const [quantity, setQuantity] = useState(0);

  const visibleImages = productDetails.slice(0, 5);
  const remainingCount = productDetails.length - 5;

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
      {/* paste your full JSX here, no changes needed */}
      <SupremeQuality />
      <YouMightAlsoLike />
    </>
  );
}
