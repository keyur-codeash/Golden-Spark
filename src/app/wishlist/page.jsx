"use client";

import React, { useEffect, useState } from "react";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import ShoppingCard from "@/components/ShoppingCard";
import { useWishlist } from "@/forntend/context/WishlistContext";
import { getwishlistData } from "@/forntend/services/wishlistServices";
import Pagination from "@/components/Pagination";

const WishlistPage = () => {
  const { wishlist, setWishlist, removeFromWishlist } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    getWishList();
  }, [currentPage]);

  const getWishList = async () => {
    try {
      const response = await getwishlistData(currentPage);
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
    <div>
      <div className="your-cart">
        <HeroSectionCommon heading="Wishlist" />
        <div className="container mx-auto" data-aos="fade-up">
          <div className={wishlist?.length && `pt-10 md:pt-20`}>
            <div className="flex-1 px-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10">
                {wishlist?.map((item) => (
                  <ShoppingCard
                    key={item?.id}
                    id={item?.id}
                    isAvailable={item.isAvailable}
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
};

export default WishlistPage;
