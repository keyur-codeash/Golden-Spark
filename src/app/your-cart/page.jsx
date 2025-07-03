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
import AOS from "aos";
import "aos/dist/aos.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      img: "/images/image-1.png",
      heading: "Stone Pointed Toe Rings",
      price: 578,
      color: "Gold",
      quantity: 1,
    },
    {
      id: "2",
      img: "/images/image-1.png",
      heading: "Sunlit Rose Gold Bracelet",
      price: 578,
      color: "Silver",
      quantity: 1,
    },
    {
      id: "3",
      img: "/images/image-1.png",
      heading: "Sunlit Rose Gold Bracelet",
      price: 578,
      color: "Silver",
      quantity: 1,
    },
  ]);
  const router = useRouter();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent 0 or negative quantity
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const changeColor = (id, newColor) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, color: newColor } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const [editingItem, setEditingItem] = useState(null);

  const handleEditItem = (item) => {
    console.log(item);

    const editdata = {
      id: item.id,
      img: item.img,
      heading: item.heading,
      price: item.price,
      color: item.color,
      quantity: item.quantity,
      size: "M", // You can modify this
    };
    setEditingItem(editdata);
  };

  console.log(editingItem);
  console.log(cartItems);

  const handleUpdateItem = (updatedItem) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="your-cart">
      <div data-aos="fade-up">
        <HeroSectionCommon heading="Home/Your Cart" />
        <div className="pt-10 md:pt-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Cart Items Section */}
              <div className="px-4 xl:px-0">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="sm:flex border border-gray-300 mb-7 rounded-sm p-3"
                  >
                    {console.log(item)}
                    <div className="relative w-full sm:w-[12rem] h-[12rem]">
                      <Image
                        src={item.img}
                        alt={item.heading}
                        fill
                        className="object-cover w-full h-full rounded-sm"
                      />
                    </div>
                    <div className="w-full pt-5 sm:pt-0 sm:w-[70%] md:ms-8">
                      <div className="flex w-full justify-between items-center">
                        <div>
                          <p className="text-xl">{item.heading}</p>
                          <p className="text-xl pt-3">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="pb-4 cursor-pointer"
                            onClick={() => removeItem(item.id)}
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
                        <div>
                          <p className="text-xl font-medium mb-2 pt-4">
                            Colors
                          </p>
                          <button
                            onClick={() => changeColor(item.id, "Gold")}
                            className={`px-4 border cursor-pointer py-1 rounded-md text-lg font-medium transition ${
                              item.color === "Gold"
                                ? "bg-yellow-800 text-white border-yellow-800"
                                : "text-gray-800"
                            }`}
                          >
                            Gold
                          </button>
                          <button
                            onClick={() => changeColor(item.id, "Silver")}
                            className={`px-4 border cursor-pointer py-1 mx-2 rounded-md text-lg font-medium transition ${
                              item.color === "Silver"
                                ? "border-gray-400 bg-gray-400 text-white"
                                : "text-gray-800"
                            }`}
                          >
                            Silver
                          </button>
                        </div>
                        <div className="sm:px-5">
                          <p className="text-xl font-medium mb-2 pt-4">
                            Quantity:
                          </p>
                          <div className="flex justify-center rounded-md items-center py-1 border px-3">
                            <button
                              className="text-xl cursor-pointer"
                              disabled={cartItems == 1}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <FiMinus
                                className={
                                  item.quantity == 1 && "text-gray-400"
                                }
                              />
                            </button>
                            <p className="px-4 text-xl w-12">{item.quantity}</p>
                            <button
                              className="text-xl cursor-pointer"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
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

                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-200 py-4"
                      >
                        <div className="grid grid-cols-2">
                          <div>{item.heading}</div>
                          <div className="text-right text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
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
                        support your experience throughout this website, and for
                        other purposes described in our privacy policy
                      </p>
                    </div>

                    <div className="py-4 bg-white">
                      <Button
                        label="CHECK OUT"
                        color="blue"
                        size="md"
                        variant="solid"
                        className="!bg-yellow-800 w-full !rounded-0 py-3 mt-2 flex items-center gap-[10px]"
                        onClick={() => router.push("check-out")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {editingItem && (
        <Modal isOpen={editingItem} maxWidth="max-w-lg">
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
