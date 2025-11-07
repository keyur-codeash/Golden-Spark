"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiMinus, FiPlus } from "react-icons/fi";
import { CgCloseR } from "react-icons/cg";
import { BiEditAlt } from "react-icons/bi";
import Button from "@/components/Button";
import EditCartItemModal from "./component/EditCartItemModal";
import { useRouter } from "next/navigation";
import Modal from "@/components/Model";
import { useAddtocart } from "@/forntend/context/AddToCartContext";
import { fetchProductVariant } from "@/forntend/services/productService";
import useToken from "@/forntend/hooks/useToken";
import { fetchAddress } from "@/forntend/services/addressServices";

function CartPage() {
  const [editingItem, setEditingItem] = useState(null);
  const [stockErrors, setStockErrors] = useState([]);
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const {
    addtocartlist,
    addtocart,
    error,
    setAddtocartlist,
    updateCartItemQuantity,
    removeFromaddtocart,
    updateCartItemColor,
    updateCartItem,
  } = useAddtocart();

  const { token } = useToken();
  const router = useRouter();

  // Check stock availability
  const checkStockAvailability = async () => {
    setIsCheckingStock(true);
    const errors = [];

    for (const item of addtocartlist) {
      try {
        if (!item.selectedVariant?.color) {
          errors.push({
            productVariantId: item.productVariantId,
            productName: item.title,
            message: "Please select a color for this product",
          });
          continue;
        }

        // Fetch variant details
        if (!token) {
          router.push("/auth/sign-in");
        }
        const variantData = await fetchProductVariant(
          item.selectedVariant.id,
          token
        );

        if (variantData.isSuccess && variantData.data.length > 0) {
          const variant = variantData.data[0];

          if (item.quantity > variant.stock) {
            errors.push({
              productVariantId: item.productVariantId,
              productName: item.title,
              variantId: variant._id,
              requested: item.quantity,
              available: variant.stock,
            });
          }
        } else {
          errors.push({
            productVariantId: item.productVariantId,
            productName: item.title,
            message: "This color and size combination is not available",
          });
        }
      } catch (error) {
        errors.push({
          productVariantId: item.productVariantId,
          productName: item.title,
          message: "Failed to check stock availability",
        });
      }
    }

    setStockErrors(errors);
    setIsCheckingStock(false);
    return errors;
  };

  const updateQuantity = (productVariantId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productVariantId, newQuantity);
    setStockErrors((prev) =>
      prev.filter((error) => error.productVariantId !== productVariantId)
    );
  };

  const removeItem = (productVariantId) => {
    removeFromaddtocart(productVariantId);
    // Remove errors
    setStockErrors((prev) =>
      prev.filter((error) => error.productVariantId !== productVariantId)
    );
  };

  // Get color name
  const getColorFromVariant = (item, colorId) => {
    return item.availableColors.find((color) => color.id === colorId);
  };

  // Handle color selection
  const handleColorSelect = (productVariantId, colorId) => {
    updateCartItemColor(productVariantId, colorId);
    setStockErrors((prev) =>
      prev.filter((error) => error.productVariantId !== productVariantId)
    );
  };

  const calculateSubtotal = () => {
    return addtocartlist.reduce(
      (total, item) =>
        total + (item.selectedVariant?.price || item.price) * item.quantity,
      0
    );
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updatedItem) => {
    // Use the proper update function instead of addtocart
    updateCartItem(updatedItem.oldproductVariantId, updatedItem);
    setEditingItem(null);
    // Clear errors for updated item
    setStockErrors((prev) =>
      prev.filter(
        (error) => error.productVariantId !== updatedItem.productVariantId
      )
    );
  };

  const handleCheckout = async () => {
    const errors = await checkStockAvailability();
    if (!errors.length || error == null) {
      const responce = await fetchAddress();
      console.log(responce);
      if (responce.data.length) {
        router.push("/check-out/address");
      } else {
        router.push("/check-out");
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (addtocartlist.length > 0) {
      checkStockAvailability();
    } else {
      setStockErrors([]);
    }
  }, [addtocartlist]);

  return (
    <div className="your-cart">
      <div>
        <HeroSectionCommon heading="Home/Your Cart" />
        <div className="pt-10 md:pt-20">
          <div className="container mx-auto">
            {/* Stock Error Messages */}
            {stockErrors.length > 0 && (
              <div className="px-4 xl:px-0 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="text-red-800 font-semibold text-lg mb-2">
                    Stock Issues Found:
                  </h3>
                  {stockErrors.map((item, index) => (
                    <div key={index} className="text-red-700 mb-1">
                      Insufficient stock for
                      <span className="font-bold"> {item.productName}. </span>
                      Requested: {item.requested}, Available: {item.available}
                    </div>
                  ))}
                  <p className="text-red-600 text-sm mt-2">
                    Please update quantities or remove items before proceeding
                    to checkout.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Cart Items Section */}
              <div className="px-4 xl:px-0">
                {addtocartlist?.length > 0 ? (
                  addtocartlist.map((item) => {
                    const hasError = stockErrors.some(
                      (error) =>
                        error.productVariantId === item.productVariantId
                    );
                    const currentColor = item.selectedVariant
                      ? getColorFromVariant(item, item.selectedVariant.color)
                      : null;

                    return (
                      <div
                        key={item.productVariantId}
                        className={`sm:flex border mb-7 rounded-sm p-3 ${
                          hasError
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="relative w-full sm:w-[12rem] h-[12rem]">
                          <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover w-full h-full rounded-sm"
                          />
                        </div>
                        <div className="w-full pt-5 sm:pt-0 sm:w-[70%] md:ms-8">
                          {hasError && (
                            <div className="text-red-600 text-sm mb-2">
                              ⚠️ This product is out of stock and the requested
                              quantity is unavailable
                            </div>
                          )}
                          <div className="flex w-full justify-between items-center">
                            <div>
                              <p className="text-xl">{item.title}</p>
                              <p className="text-xl pt-3">
                                $
                                {(
                                  item.selectedVariant?.price || item.price
                                ).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p
                                className="pb-4 cursor-pointer"
                                onClick={() =>
                                  removeItem(item.productVariantId)
                                }
                              >
                                <CgCloseR size={24} />
                              </p>
                              <p
                                className="cursor-pointer"
                                onClick={() => handleEditItem(item)}
                              >
                                <BiEditAlt size={24} />
                              </p>
                            </div>
                          </div>
                          <div className="flex text-nowrap justify-start items-center">
                            <div className="mt-4.5">
                              <h3 className="text-lg font-medium mb-1.5 text-gray-800">
                                Colours:
                              </h3>
                              <div className="flex gap-3 flex-wrap">
                                {item.availableColors?.map((color) => {
                                  const isSelected =
                                    item.selectedVariant?.color === color.id;
                                  return (
                                    <button
                                      key={color.id}
                                      type="button"
                                      onClick={() =>
                                        handleColorSelect(
                                          item.productVariantId,
                                          color.id
                                        )
                                      }
                                      style={{
                                        backgroundColor: isSelected
                                          ? color.color
                                          : "transparent",
                                        border: `1px solid ${
                                          isSelected ? color.color : "#000"
                                        }`,
                                        color: isSelected ? "#fff" : "black",
                                      }}
                                      className={`px-4 py-1 cursor-pointer rounded-md text-lg font-medium transition`}
                                    >
                                      {color.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="sm:px-5">
                              <p className="text-lg font-medium mb-2 pt-4.5">
                                Quantity:
                              </p>

                              <div className="flex justify-center rounded-md items-center py-1 border px-3">
                                <button
                                  className="text-xl cursor-pointer"
                                  disabled={item.quantity === 1}
                                  onClick={() =>
                                    updateQuantity(
                                      item.productVariantId,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <FiMinus
                                    className={
                                      item.quantity === 1 ? "text-gray-400" : ""
                                    }
                                  />
                                </button>
                                <p className="px-4 text-xl w-12">
                                  {item.quantity}
                                </p>
                                <button
                                  className="text-xl cursor-pointer"
                                  disabled={
                                    hasError ||
                                    item.quantity ==
                                      process.env.NEXT_PUBLIC_MAX_QUANTITY
                                      ? true
                                      : false
                                  }
                                  onClick={() =>
                                    updateQuantity(
                                      item.productVariantId,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <FiPlus
                                    className={
                                      item.quantity ==
                                      process.env.NEXT_PUBLIC_MAX_QUANTITY
                                        ? "text-gray-400"
                                        : ""
                                    }
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div></div>
                )}
              </div>

              {/* Order Summary - Only show if there are items in cart */}
              {addtocartlist?.length > 0 && (
                <div className="px-4 xl:px-0 xl:ms-35 select-none lg:px-8">
                  <div className="mx-auto bg-white border-4 border-brown-300 rounded-lg p-4 md:p-6 lg:p-10 shadow-md overflow-hidden">
                    <div className="pb-4 border-b- border-gray-200">
                      <h1 className="text-2xl font-bold text-gray-800 select-none">
                        Your Orders
                      </h1>
                    </div>

                    <div className="text-md md:text-xl">
                      <div className="grid grid-cols-2 py-4 font-semibold border-b border-gray-200 text-gray-700">
                        <div>Product</div>
                        <div className="text-right">Subtotal</div>
                      </div>

                      {addtocartlist.map((item) => (
                        <div
                          key={item.productVariantId}
                          className="border-b border-gray-200 py-4"
                        >
                          <div className="grid grid-cols-2">
                            <div>{item.title}</div>
                            <div className="text-right text-gray-800">
                              $
                              {(
                                (item.selectedVariant?.price || item.price) *
                                item.quantity
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="divide-y divide-gray-200">
                        <div className="grid grid-cols-2 py-4 font-semibold text-gray-700">
                          <div>Sub Total</div>
                          <div className="text-right">
                            ${calculateSubtotal().toFixed(2)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 mt-2 py-3">
                          <div className="font-bold">Total</div>
                          <div className="text-right font-bold">
                            ${calculateSubtotal().toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <textarea
                        id="message"
                        rows="4"
                        className="block w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-white text-black 
                      focus:outline-none focus:ring-0 focus:border-gray-300 
                      hover:border-gray-300 
                      placeholder:font-medium placeholder:text-lg placeholder:text-black"
                        placeholder="Note:"
                      ></textarea>

                      <div className="pt-8">
                        <p>
                          Your personal data will be used to process your order,
                          support your experience throughout this website, and
                          for other purposes described in our privacy policy
                        </p>
                      </div>
                      {stockErrors.length > 0 && (
                        <p className="text-red-600 text-sm mt-4">
                          Please resolve stock issues before checkout
                        </p>
                      )}

                      <div className="py-4 bg-white">
                        <Button
                          label={
                            isCheckingStock ? "CHECKING STOCK..." : "CHECK OUT"
                          }
                          color="blue"
                          size="md"
                          variant="solid"
                          disabled={isCheckingStock || stockErrors.length > 0}
                          className={`w-full !rounded-0 py-3 mt-2 flex items-center gap-[10px] ${
                            stockErrors.length > 0
                              ? "!bg-gray-400 cursor-not-allowed"
                              : "!bg-yellow-800"
                          }`}
                          onClick={handleCheckout}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {editingItem && (
        <Modal isOpen={true} maxWidth="max-w-lg">
          <div className="fixed inset-0 z-50 h-screen w-screen overflow-hidden ">
            <div className="relative z-10 flex items-center justify-center h-full w-full">
              <EditCartItemModal
                item={editingItem}
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onUpdate={handleUpdateItem}
                onRemove={removeItem}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CartPage;