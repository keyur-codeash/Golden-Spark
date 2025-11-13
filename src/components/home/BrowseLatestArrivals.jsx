"use client";

import React, { useEffect, useState } from "react";
import Heading from "../Heading";
import ShoppingCard from "../ShoppingCard";
import { fetchNewArrivalProducts } from "@/forntend/services/productService";
import AOS from "aos";
import { useWishlist } from "@/forntend/context/WishlistContext";
import { useRouter } from "next/navigation";
import useToken from "@/forntend/hooks/useToken";

const BrowseLatestArrivals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { token } = useToken();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchNewArrivalProducts();
      if (token) {
        const updatedProducts = response.data.map((product) => ({
          ...product,
          isWishlist: isInWishlist(product.id),
        }));
        setProducts(updatedProducts);
      } else {
        setProducts(response.data);
      }

      setIsLoading(false);
    };

    getProducts();
  }, [isInWishlist]);

  const handleWishlistUpdate = async (product) => {
    if (isInWishlist(product.id)) {
      const response = await removeFromWishlist(product.id);
      return response;
    } else {
      const response = await addToWishlist(product);
      return response;
    }
  };

  if (!products.length) {
    return false;
  }

  return (
    <div className="shopByCollection pt-20">
      <div className="container mx-auto">
        <div data-aos="fade-down">
          <Heading className="text-brown-900" color="text-brown-900">
            Browse Latest Arrivals
          </Heading>

          <div className="flex justify-center pb-7">
            <p className="text-gray-500 text-center w-2xl py-4">
              Our fashion jewellery is inspired by minimalism, focused on
              minimal simplicity, perfect for everyday wear and cherished for
              years.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 gap-y-10 gap-x-0 lg:gap-x-0  ">
          {products.map((item, index) => (
            <ShoppingCard
              key={item.id}
              id={item.id}
              image={item?.images[0]}
              text={item.title}
              price={item.price}
              isLink={true}
              isWishList={isInWishlist(item.id)}
              onCardUpdateData={() => handleWishlistUpdate(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowseLatestArrivals;
