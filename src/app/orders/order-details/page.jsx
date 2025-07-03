"use client";
import React, { useState } from "react";
import CancelOrderModal from "../component/CancelOrderModal";
import CancelOrder from "../cancel/page";
import TrackingModalPage from "../component/TrackingModalPage";

export default function OrderConfirmation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrakingModalOpen] = useState(false);
  const [orderCancelModalOpen, setOrderCancelModalOpen] = useState(false);

  return (
    <div className="pt-2 lg:pt-15">
      <CancelOrderModal
        setIsModalOpen={setOrderCancelModalOpen}
        isModalOpen={orderCancelModalOpen}
      />
      <TrackingModalPage
        isModalOpen={isTrackingModalOpen}
        setIsModalOpen={setIsTrakingModalOpen}
      />
      <CancelOrder
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setOrderCancelModalOpen={setOrderCancelModalOpen}
        orderCancelModalOpen={setOrderCancelModalOpen}
      />
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 xl:gap-30 px-5">
          <div className="px-auto w-full rounded-lg">
            {/* Header */}
            <div className="flex justify-between text-lg sm:text-2xl items-center border-b-1 border-gray-300 py-4 b-2 mb-4">
              <h1 className=" font-semibold text-gray-800">Order Details</h1>
              <span className="font-bold text-gray-800">Total</span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 text-xl">
                <p className="text-gray-700">
                  Order ID: <span className="font-normal">#904554</span>
                </p>
                <div className="mt-2 border-b pb-4 border-gray-300 flex justify-between">
                  <div className="">
                    <p className="text-gray-800 pb-2">
                      Stone Pointed Toe Rings
                    </p>
                    <p>Colours: Gold Quantity: 02</p>
                  </div>
                  <p className="text-gray-800">$300.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Items</p>
                  <p>$300.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Delivery</p>
                  <p>$0.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Tax</p>
                  <p className="font-medium">$50.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Shipping:</p>
                  <p className="text-gray-500">Local Delivery</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Payment method:</p>
                  <p className="text-gray-500">Online Delivery</p>
                </div>

                <div className="mt-4 flex text-xl justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800  font-medium">Total</p>
                  <p className="text-gray-800 font-medium">$350.00</p>
                </div>

                <div className="mt-6 grid md:w-lg lg:max-w-md xl:max-w-lg grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-9">
                  <div>
                    <p className="text-xl sm:text-2xl pb-3 font-medium">
                      Billing Address:
                    </p>
                    <p className="text-md sm:text-lg">
                      50 Washington Square S, New York, NY 10012, USA...
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl pb-3 font-medium">
                      Shipping Address:
                    </p>
                    <p className="text-md sm:text-lg">
                      50 Washington Square S, New York, NY 10012, USA...
                    </p>
                  </div>
                </div>

                {/* <Button
                    label="CANCEL"
                    color="blue"
                    size="md"
                    variant="outline"
                    className="!rounded-none !text-black py-2.5 mt-5 flex items-center gap-[10px]"
                    onClick={() => setIsModalOpen(true)}
                  /> */}

                {/* Buttons */}
                <div className="mt-6 flex gap-4 select-none">
                  <button
                    className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 cursor-pointer bg-yellow-800 text-white rounded-md hover:bg-yellow-600"
                    onClick={() => setIsTrakingModalOpen(true)}
                  >
                    Track
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section (Summary) */}
          <div className="pt-5">
            <div className="shadow-md rounded-lg xl:w-md">
              <h2 className="mb-4 px-5 pt-10 text-md sm:text-lg">
                Thank you. Your order has been received.
              </h2>
              <ul className="text-gray-700 p-10 pt-0 list-disc space-y-2 text-lg sm:text-xl">
                <li>
                  Order number: <span>#904554</span>
                </li>
                <li>
                  Date: <span>April 13, 2025</span>
                </li>
                <li>
                  Total: <span>$350.00</span>
                </li>
                <li>
                  Payment method:
                  <span>Online Delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
