"use client";
import Button from "@/components/Button";
import Modal from "@/components/Model";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CancelOrder = ({
  isModalOpen,
  setIsModalOpen,
  setOrderCancelModalOpen,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const order = {
    id: "1",
    orderId: "#904554",
    heading: "Stone Pointed Toe Rings",
    price: 578.0,
    color: "Gold",
    quantity: 2,
    date: "18 April, 2025",
    img: "/images/instagram_one.png",
    cancellationReasons: [
      "Incorrect size ordered",
      "Product not required anymore",
      "Expected a shorter delivery time",
      "Found better price elsewhere",
      "Wants to change style/color",
      "Delayed Delivery Cancellation",
      "Duplicate Order",
      "Other",
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a cancellation reason");
      return;
    }
    setError("");
    console.log({ reason: selectedReason, description });
    setIsModalOpen(false);
    setOrderCancelModalOpen(true);
    alert(
      `Order cancellation submitted successfully!\nReason: ${selectedReason}\nDescription: ${
        description || "None"
      }`
    );
    setSelectedReason("");
    setDescription("");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      maxWidth="mx-1/2"
    >
      {/* Order Details */}
      <div className="flex flex-col sm:flex-row p-4 border-b">
        <div className="w-full sm:w-40 h-40 bg-gray-200 rounded-md mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 relative">
          <Image
            src={order.img}
            alt={order.heading}
            fill
            sizes="(max-width: 640px) 100vw, 160px"
            className="object-cover rounded-md"
            priority
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-sm sm:text-base">
            <p>Order ID: {order.orderId}</p>
            <p>Date: {order.date}</p>
          </div>
          <p className="mt-1">{order.heading}</p>
          <p className="mt-1">Price: ${order.price.toFixed(2)}</p>
          <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
            <p>Colour: {order.color}</p>
            <p>Quantity: {order.quantity}</p>
          </div>
          <p className="text-right cursor-pointer mt-1">
            <Link href="#">View Policy</Link>
          </p>
        </div>
      </div>

      {/* Cancellation Form */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Reason for Cancellation</h2>
        <p className="text-gray-500 mb-4">
          Please tell us the correct reason for cancellation. This information
          is only used to improve our service.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-medium mb-2">
            Select a cancellation reason*
          </label>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="space-y-2 mb-4">
            {order.cancellationReasons.map((reason) => (
              <div key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mr-2 h-4 w-4"
                />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <label className="block text-lg font-medium mb-2">
            Describe your reason here (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-1"
            placeholder="Your message here..."
          ></textarea>
          <div className="pt-8">
            <Button
              label="CONFIRM CANCELLATION"
              type="submit"
              color="blue"
              size="md"
              variant="solid"
              className="!bg-yellow-800 w-full !rounded-none py-3 flex items-center gap-[10px]"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CancelOrder;
