"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getwishlistData,
  addWishlistData,
  deleteWishlistData,
} from "../services/wishlistServices";
import useToken from "../hooks/useToken";
import { useRouter } from "next/navigation";
const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { token } = useToken();
  const router = useRouter();
  useEffect(() => {
    const getWishList = async () => {
      try {
        const response = await getwishlistData();
        setWishlist(response.data);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };
    if (token) {
      getWishList();
    } else {
      setWishlist([]);
    }
  }, []);

  const addToWishlist = async (product) => {
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }
    try {
      const response = await addWishlistData({ productId: product.id });
      setWishlist((prev) => [...prev, product]);
      return response;
    } catch (err) {
      console.error("Failed to add to wishlist", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await deleteWishlistData(productId);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      return response;
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const isInWishlist = (productId) =>
    wishlist?.some((item) => item.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
