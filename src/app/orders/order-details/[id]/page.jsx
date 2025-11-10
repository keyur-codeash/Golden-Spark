"use client";
import React, { useEffect, useState } from "react";
import CancelOrderModal from "../../component/CancelOrderModal";
import CancelOrder from "../../cancel/page";
import TrackingModalPage from "../../component/TrackingModalPage";
import { fetchSingleOrder } from "@/forntend/services/orderServices";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";
import { fetchTrackOrder } from "@/forntend/services/trackOrderService";

export default function  OrderConfirmation({ params }) {
  const { id } = params;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrakingModalOpen] = useState(false);
  const [orderCancelModalOpen, setOrderCancelModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDetails, setCancelDetails] = useState({});
  const [orderTrakingDetails, setOrderTrakingDetails] = useState({});

  useEffect(() => {
    const getSingleOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchSingleOrder(id);
        if (response?.isSuccess && response.data?.length > 0) {
          setOrderDetails(response.data[0]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    getSingleOrderDetails();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  const abcd = formatDate(orderDetails?.orderCreated);
  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle missing order
  if (!orderDetails || Object.keys(orderDetails).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className=" p-8 rounded-2xl  transition-all duration-300 max-w-md w-full">
          {/* Cancel Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className>
              <MdCancel className="text-yellow-800 text-8xl" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Order Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-lg mb-6">
            We couldn’t find your order or it may have failed to load. Please
            try again or contact support if the issue persists.
          </p>

          <div>
            <Button
              label="Back to Orders"
              color="blue"
              size="md"
              variant="solid"
              className="!bg-yellow-800 hover:!bg-yellow-700 w-full !rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleTrackOrder = async (id) => {
    const response = await fetchTrackOrder(id);
    if (response.isSuccess) {
      setOrderTrakingDetails(response.data);
    }
    setIsTrakingModalOpen(true);
  };

  return (
    <div className="pt-2 lg:pt-15">
      {/* Modals */}
      <CancelOrderModal
        orderDetails={orderDetails}
        setIsModalOpen={setOrderCancelModalOpen}
        isModalOpen={orderCancelModalOpen}
        cancelDetails={cancelDetails}
      />

      <TrackingModalPage
        setOrderTrakingDetails={setOrderTrakingDetails}
        orderTrakingDetails={orderTrakingDetails}
        isModalOpen={isTrackingModalOpen}
        setIsModalOpen={setIsTrakingModalOpen}
      />

      <CancelOrder
        orderDetails={orderDetails}
        isModalOpen={isModalOpen}
        setCancelDetails={setCancelDetails}
        setIsModalOpen={setIsModalOpen}
        setOrderCancelModalOpen={setOrderCancelModalOpen}
        orderCancelModalOpen={setOrderCancelModalOpen}
      />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 xl:gap-30 px-5">
          <div className="px-auto w-full rounded-lg">
            <div className="flex justify-between text-lg sm:text-2xl items-center border-b border-gray-300 py-4 mb-4">
              <h1 className="font-semibold text-gray-800">Order Details</h1>
              <span className="font-bold text-gray-800">Total</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 text-xl">
                <p className="text-gray-700">
                  Order ID:
                  <span className="font-normal">#{orderDetails.order_id}</span>
                </p>

                {orderDetails?.items?.map((product, index) => (
                  <div
                    key={index}
                    className="mt-2 border-b pb-4 border-gray-300 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-gray-800 pb-2">
                        {product?.product_name}
                      </p>
                      <p>
                        Colour: {product?.color} | Quantity: {product?.quantity}
                        .00
                      </p>
                    </div>
                    <p className="text-gray-800">${product.itemTotal}.00</p>
                  </div>
                ))}

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Items</p>
                  <p>${orderDetails.itemsTotal}.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Delivery</p>
                  <p>${orderDetails.deliveryFee}.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Tax</p>
                  <p className="font-medium">${orderDetails.tax}.00</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Shipping:</p>
                  <p className="text-gray-500">Local Delivery</p>
                </div>

                <div className="mt-4 flex justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Payment method:</p>
                  <p className="text-gray-500">{orderDetails.paymentMethod}</p>
                </div>

                <div className="mt-4 flex text-xl justify-between border-b pb-4 border-gray-300">
                  <p className="text-gray-800 font-medium">Total</p>
                  <p className="text-gray-800 font-medium">
                    ${orderDetails.grandTotal}.00
                  </p>
                </div>

                {/* Address Section */}
                <div className="mt-6 grid md:w-lg lg:max-w-md xl:max-w-lg grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-9">
                  <div>
                    <p className="text-xl sm:text-2xl pb-3 font-medium">
                      Billing Address:
                    </p>
                    <p className="text-md sm:text-lg">
                      {orderDetails?.address?.address}{" "}
                      {orderDetails?.address?.country}.{" "}
                      {orderDetails?.address?.city}{" "}
                      {orderDetails?.address?.state}{" "}
                      {orderDetails?.address?.country}{" "}
                      {orderDetails?.address?.zipCode}
                      {/* 50 Washington Square S, New York, NY 10012, USA... */}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl pb-3 font-medium">
                      Shipping Address:
                    </p>
                    <p className="text-md sm:text-lg">
                      {orderDetails?.address?.address}{" "}
                      {orderDetails?.address?.country}.{" "}
                      {orderDetails?.address?.city}{" "}
                      {orderDetails?.address?.state}{" "}
                      {orderDetails?.address?.country}{" "}
                      {orderDetails?.address?.zipCode}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-4 select-none">
                  <button
                    className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 cursor-pointer bg-yellow-800 text-white rounded-md hover:bg- yellow-600"
                    onClick={() => handleTrackOrder(orderDetails.order_id)}
                  >
                    Track
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="shadow-md rounded-lg xl:w-md">
              <h2 className="mb-4 px-5 pt-10 text-md sm:text-lg">
                Thank you. Your order has been received.
              </h2>
              <ul className="text-gray-700 p-10 pt-0 list-disc space-y-2 text-lg sm:text-xl">
                <li>
                  Order number: <span>#{orderDetails.order_id}</span>
                </li>
                <li>
                  Date:{" "}
                  <span>
                    {formatDate(orderDetails?.orderCreated)}
                  </span>
                </li>
                <li>
                  Total: <span> ${orderDetails.grandTotal}.00</span>
                </li>
                <li>
                  Payment method:
                  <span> {orderDetails.paymentMethod}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
