"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import ShoppingCard from "@/components/ShoppingCard";
import { useWishlist } from "@/forntend/context/WishlistContext";
import { getwishlistData } from "@/forntend/services/wishlistServices";
import Pagination from "@/components/Pagination";

function WishlistPage() {
  const { wishlist, setWishlist, removeFromWishlist } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    getWishList();
  }, [currentPage]);

  const getWishList = async () => {
    try {
      const response = await getwishlistData(currentPage);
      console.log(response);
      setTotalPages(response.totalPages || 1);
      setWishlist(response.data);
      setTotalItems(response.totalItems || 0);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const handleWishlistUpdate = async (product) => {
    await removeFromWishlist(product.id);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    setCurrentPage(1);
  };

  return (
    <div data-aos="fade-up">
      <div className="your-cart">
        <HeroSectionCommon heading="Home / Wishlist" />
        <div className="container mx-auto">
          <div className="pt-10 md:pt-20">
            <div className="pb-10 flex-1 px-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10">
                {wishlist?.map((item) => (
                  <ShoppingCard
                    key={item?.id}
                    id={item?.id}
                    image={item?.images[0]}
                    text={item?.title}
                    price={item.price}
                    isWishList={true}
                    onCardUpdateData={() => handleWishlistUpdate(item)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Pagination Below Products */}
          {totalPages > 1 && (
            <div className="pb-5">
              <div className="p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
