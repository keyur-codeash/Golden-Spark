"use client";
import Button from "@/components/Button";
import Modal from "@/components/Model";
import {
  cancelOrder,
  fetchSingleOrder,
  orderCancellationReasons,
} from "@/forntend/services/orderServices";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CancelOrder = ({
  isModalOpen,
  setIsModalOpen,
  setOrderCancelModalOpen,
  orderDetails,
  setCancelDetails,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [cancellationReasons, setCancellationReasons] = useState([]);
  // const [ordeerDetails, setOrdeerDetails] = useState([]);

  const order = {
    id: "1",
    orderId: "#904554",
    heading: "Stone Pointed Toe Rings",
    price: 578.0,
    color: "Gold",
    quantity: 2,
    date: "18 April, 2025",
    img: "/images/instagram_one.png",
    // cancellationReasons: [
    //   "Incorrect size ordered",
    //   "Product not required anymore",
    //   "Expected a shorter delivery time",
    //   "Found better price elsewhere",
    //   "Wants to change style/color",
    //   "Delayed Delivery Cancellation",
    //   "Duplicate Order",
    //   "Other",
    // ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a cancellation reason");
      return;
    }
    setError("");
    setIsModalOpen(false);
    setOrderCancelModalOpen(true);
    setCancelDetails({
      _id: orderDetails?.order_id,
      cancelReason: selectedReason,
      cancelDescription: description,
    });

    // alert(
    //   `Order cancellation submitted successfully!\nReason: ${selectedReason}\nDescription: ${
    //     description || "None"
    //   }`
    // );

    // console.log(orderDetails);

    // const response = await cancelOrder({
    //   _id: orderDetails.order_id,
    //   cancelReason: selectedReason,
    //   cancelDescription: description,
    // });

    // console.log("response==================", response);

    // Reset form fields

    setSelectedReason("");
    setDescription("");
  };

  // useEffect(() => {
  //   const fetchSingleOrderDetails =async () => {
  // const responce = await fetchSingleOrder();
  // }
  // fetchSingleOrderDetails();
  // }, [])

  // const response = await cancelOrder(body);

  // const handleCancelOrder = (id) => {
  //   console.log("orderid==========", id);
  // };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await orderCancellationReasons();
        if (response.isSuccess) {
          setCancellationReasons(response.data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, []);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      maxWidth="mx-1/2"
    >
      {/* Order Details */}
      <div className="flex flex-col sm:flex-row px-4 pb-5 pt-15 bg-brown-300/30  border-b-3 border-gray-200">
        <div className="w-full sm:w-40 h-40 bg-gray-200 rounded-md mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 relative">
          <Image
            src={order.img}
            alt={order.heading}
            fill
            sizes="(max-width: 640px) 100vw, 160px"
            className="object-cover rounded-sm"
            priority
          />
        </div>

        <div className="flex-1 ">
          <di className="flex justify-between text-sm sm:text-base">
            <p>Order ID: #{orderDetails?.order_id}</p>
            <p>Date: {orderDetails?.orderCreated}</p>
          </di>

          {orderDetails?.items?.map((item, index) => (
            <div
              key={index}
              className={`${index == 0 ? "pb-3" : "pt-2"} ${
                orderDetails?.items.length - 1 === index
                  ? "!border-b-0"
                  : "border-b border-gray-400"
              }`}
            >
              <p className="mt-1">{item.product_name}</p>
              <p className="mt-1">Price: ${item.price?.toFixed(2)}</p>
              <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                <p>Colour: {item.color}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}

          <p className="text-right cursor-pointer mt-1">
            <Link href="#">View Policy</Link>
          </p>
        </div>

        {/* <div className="flex-1">
          <div className="flex justify-between text-sm sm:text-base">
            <p>Order ID: {orderDetails?.order_id}</p>
            <p>Date: {orderDetails?.orderCreated}</p>
          </div>
          <p className="mt-1">{orderDetails?.items[0]?.product_name}</p>
          <p className="mt-1">
            Price: ${orderDetails?.items[0]?.price?.toFixed(2)}
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
            <p>Colour: {orderDetails?.items[0].color}</p>
            <p>Quantity: {orderDetails?.items[0].quantity}</p>
          </div>
          <p className="text-right cursor-pointer mt-1">
            <Link href="#">View Policy</Link>
          </p>
        </div> */}
      </div>
      {/* Cancellation Form */}
      <div className="p-6 pb-0 ">
        <h2 className="text-2xl lg:text-3xl font-semibold my-2">
          Reason For Cancellation
        </h2>
        <p className="text-gray-500  mb-4 border-b-1 pb-4 border-gray-300">
          Please tell us the correct reason for cancellation. This information
          is only used to improve our service.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-medium mb-2">
            Select a cancellation reason*
          </label>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="space-y-2 mb-4">
            {cancellationReasons.map((reason) => (
              <div key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value={reason._id}
                  checked={selectedReason === reason._id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="me-3"
                />
                <span>{reason.reason}</span>
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
          <div className="py-8">
            <Button
              label="CONFIRM CANCELLATION"
              type="submit"
              color="blue"
              size="md"
              variant="solid"
              className="!bg-yellow-800 w-full rounded- py-3 flex items-center gap-[10px]"
              // onClick={() => handleCancelOrder(orderDetails.order_id)}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CancelOrder;
