"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import useToken from "../hooks/useToken";
import { fetchSingleProduct } from "../services/productService";
import Toast from "@/components/toastService";
const AddToCartContext = createContext();
const { useRouter } = require("next/navigation");

export const useAddtocart = () => useContext(AddToCartContext);

export const AddToCartProvider = ({ children }) => {
  const [addtocartlist, setAddtocartlist] = useState(
    JSON?.parse(localStorage.getItem("addTocart")) || []
  );
  const [error, setError] = useState(null);
  const MAX_QUANTITY = process.env.NEXT_PUBLIC_MAX_QUANTITY || 4;
  const { token } = useToken();
  const router = useRouter();

  const generateProductVariantId = (productId, variant = null) => {
    if (!variant) return `${productId}_no_variant`;
    return `${productId}_${variant.color}_${variant.size || "no_size"}`;
  };

  const addtocart = async (id, selectedVariant = null) => {
    if (!localStorage.getItem("token")) {
      router.push("/auth/sign-in");
      return false;
    }

    try {
      let variantToUse = selectedVariant;
      if (!variantToUse) {
        const response = await fetchSingleProduct(id, token);
        if (response?.isSuccess && response.data) {
          variantToUse = response.data.allVariants?.[0] || null;
        }
      }

      const productVariantId = generateProductVariantId(id, variantToUse);
      const findProduct = addtocartlist.find(
        (item) => item.productVariantId === productVariantId
      );

      if (findProduct) {
        if (findProduct.quantity >= MAX_QUANTITY) {
          Toast.error(
            `Maximum quantity of ${MAX_QUANTITY} allowed per product`
          );
          setError("Maximum quantity reached");
          return false;
        }

        setAddtocartlist((prev) =>
          prev.map((item) => {
            if (item.productVariantId === productVariantId) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          })
        );
        setError(null);
        return true;
      } else {
        const response = await fetchSingleProduct(id, token);
        if (response?.isSuccess && response.data) {
          const productData = response.data;

          setAddtocartlist((prev) => [
            ...prev,
            {
              ...productData,
              quantity: 1,
              productVariantId: productVariantId,
              selectedVariant: variantToUse,
              price: variantToUse?.price || productData.price,
              stock: variantToUse?.stock || productData.stock,
            },
          ]);
          return true;
        } else {
          console.error(
            "Failed to fetch product or invalid response structure."
          );
          return false;
        }
      }
    } catch (error) {
      console.error("Error in addtocart:", error);
      return false;
    }
  };

  const updateCartItem = (oldProductVariantId, updatedItem) => {
    setAddtocartlist((prev) => {
      const duplicateIndex = prev.findIndex(
        (item) =>
          item.productVariantId === updatedItem.productVariantId &&
          item.productVariantId !== oldProductVariantId
      );

      if (duplicateIndex !== -1) {
        return prev
          .map((item, index) =>
            index === duplicateIndex
              ? { ...item, quantity: item.quantity + updatedItem.quantity }
              : item
          )
          .filter((item) => item.productVariantId !== oldProductVariantId);
      } else {
        return prev.map((item) =>
          item.productVariantId === oldProductVariantId ? updatedItem : item
        );
      }
    });
  };

  const updateCartItemVariant = (productVariantId, colorId, sizeId) => {
    setAddtocartlist((prevItems) => {
      const itemIndex = prevItems.findIndex(
        (item) => item.productVariantId === productVariantId
      );
      if (itemIndex === -1) return prevItems;

      const item = prevItems[itemIndex];

      const newVariant = item.allVariants.find(
        (variant) => variant.color === colorId && variant.size === sizeId
      );

      if (!newVariant) return prevItems;

      const newProductVariantId = generateProductVariantId(item.id, newVariant);

      const duplicateIndex = prevItems.findIndex(
        (p, idx) =>
          p.productVariantId === newProductVariantId && idx !== itemIndex
      );

      if (duplicateIndex !== -1) {
        return prevItems
          .map((p, idx) =>
            idx === duplicateIndex
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          )
          .filter((p, idx) => idx !== itemIndex);
      }

      // Otherwise just update this item
      return prevItems.map((p, idx) =>
        idx === itemIndex
          ? {
              ...p,
              selectedVariant: newVariant,
              productVariantId: newProductVariantId,
              price: newVariant.price,
              stock: newVariant.stock,
            }
          : p
      );
    });
  };

  // Update cart item color only
  const updateCartItemColor = (productVariantId, colorId) => {
    setAddtocartlist((prevItems) =>
      prevItems.map((item) => {
        if (item.productVariantId !== productVariantId) return item;

        const newVariant = item.allVariants.find(
          (variant) => variant.color === colorId
        );

        if (!newVariant) return item;

        const newProductVariantId = generateProductVariantId(
          item.id,
          newVariant
        );

        return {
          ...item,
          selectedVariant: newVariant,
          productVariantId: newProductVariantId,
          price: newVariant.price,
          stock: newVariant.stock,
        };
      })
    );
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productVariantId, newQuantity) => {
    if (newQuantity > MAX_QUANTITY) {
      Toast.success(
        `We're sorry! Only ${MAX_QUANTITY} unit(s) allowed in each order`
      );
      return;
    }

    setAddtocartlist((prevItems) =>
      prevItems.map((item) =>
        item.productVariantId === productVariantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromaddtocart = (productVariantId) => {
    setAddtocartlist((prevItems) =>
      prevItems.filter((item) => item.productVariantId !== productVariantId)
    );
  };

  const removeAllAddToCartList = () => {
    localStorage.removeItem("addTocart");
    setAddtocartlist([]);
  };

  useEffect(() => {
    localStorage.setItem("addTocart", JSON.stringify(addtocartlist));
  }, [addtocartlist]);

  return (
    <AddToCartContext.Provider
      value={{
        error,
        setError,
        addtocartlist,
        setAddtocartlist,
        addtocart,
        removeFromaddtocart,
        updateCartItemColor,
        updateCartItemVariant,
        updateCartItemQuantity,
        updateCartItem,
        generateProductVariantId,
        removeAllAddToCartList,
      }}
    >
      {children}
    </AddToCartContext.Provider>
  );
};
