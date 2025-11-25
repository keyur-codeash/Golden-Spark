"use client"; // Ensure client-side rendering for this component

import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { TbFilter } from "react-icons/tb";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import CancelOrder from "./cancel/page";
import TrackingModalPage from "./component/TrackingModalPage";
import CancelOrderModal from "./component/CancelOrderModal";
import { fetchOrder } from "@/forntend/services/orderServices";
import { fetchTrackOrder } from "@/forntend/services/trackOrderService";
import { formatDate } from "@/forntend/common/commonDateFormat";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [orderCancelModalOpen, setOrderCancelModalOpen] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Pending");
  const [cancelOrrderDetails, setCancelOrrderDetails] = useState({});
  const dropdownRef = useRef(null);
  const [cancelDetails, setCancelDetails] = useState({});
  const [cancelId, setCancelId] = useState(null);
  const [orderTrakingDetails, setOrderTrakingDetails] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (cancelId !== null) {
      setAllOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id != cancelId)
      );
      setCancelId(null);
    }
  }, [cancelId]);

  // Group orders by order_id
  const groupedOrders = useMemo(() => {
    const grouped = {};
    allOrders?.forEach((item) => {
      if (!grouped[item.order_id]) grouped[item.order_id] = [];
      grouped[item.order_id].push(item);
    });

    return Object.keys(grouped).map((orderId) => ({
      orderId,
      products: grouped[orderId],
      orderCreated: grouped[orderId][0]?.orderCreated,
      status: grouped[orderId][0]?.status,
    }));
  }, [allOrders]);

  // Fetch orders from API
  const getAllOrders = async (filterValue) => {
    const response = await fetchOrder(filterValue);
    if (response?.isSuccess) {
      setAllOrders(response.data || []);
    } else {
      setAllOrders([]);
    }
  };

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setOpenFilter(false);
  };

  useEffect(() => {
    getAllOrders(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrderCancel = (data) => {
    const details = {
      order_id: data.orderId,
      orderCreated: data.orderCreated,
      items: data?.products
        ? data?.products?.map((product) => ({
            product_name: product.product_name,
            color: product.color,
            price: product.price,
            quantity: product.quantity,
            size: product.size,
          }))
        : [],
    };

    setCancelOrrderDetails(details);
    setIsModalOpen(true);
  };

  const handleTrackOrder = async (id) => {
    const response = await fetchTrackOrder(id);
    if (response?.isSuccess) {
      setOrderTrakingDetails(response.data);
    }
    setIsTrackingModalOpen(true);
  };

  return (
    <div>
      {orderCancelModalOpen && (
        <CancelOrderModal
          orderDetails={cancelOrrderDetails}
          setIsModalOpen={setOrderCancelModalOpen}
          isModalOpen={orderCancelModalOpen}
          cancelDetails={cancelDetails}
          setCancelId={setCancelId}
        />
      )}
      <TrackingModalPage
        isModalOpen={isTrackingModalOpen}
        setIsModalOpen={setIsTrackingModalOpen}
        orderTrakingDetails={orderTrakingDetails}
      />
      <CancelOrder
        orderDetails={cancelOrrderDetails}
        isModalOpen={isModalOpen}
        setCancelDetails={setCancelDetails}
        setIsModalOpen={setIsModalOpen}
        setOrderCancelModalOpen={setOrderCancelModalOpen}
        orderCancelModalOpen={setOrderCancelModalOpen}
      />

      <div className="container mx-auto">
        {/* Header Section */}
        <div
          className="sm:flex justify-between items-center sm:pt-8 px-4 lg:px-0 lg:w-3/5 relative"
          ref={dropdownRef}
        >
          <div className="text-start">
            <Heading className="!px-0 text-start">All Orders</Heading>
            <p className="pt-2">From anytime</p>
          </div>

          {/* Filter Dropdown */}
          <div className="relative pt-4 md:pt-0">
            <Button
              label={`Filters: ${selectedFilter}`}
              icon={<TbFilter className="text-xl" />}
              color="blue"
              size="md"
              variant="solid"
              className="!bg-brown-900 py-3 lg:mt-5 flex items-center !m-0"
              onClick={() => setOpenFilter((prev) => !prev)}
            />

            {openFilter && (
              <div className="absolute sm:right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {["Pending", "Delivered", "Cancelled"].map((item) => (
                  <div
                    key={item}
                    onClick={() => handleSelectFilter(item)}
                    className={`px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${
                      selectedFilter === item ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-5 md:gap-7 lg:gap-5 pt-5">
          {groupedOrders.length === 0 ? (
            <div className="pt-5 text-gray-500 px-4 sm:px-0">
              No {selectedFilter} orders found.
            </div>
          ) : (
            groupedOrders.map((order, index) => {
              const firstProduct = order.products[0];
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 items-start p-2 sm:p-5 border mx-4 xl:mx-0 lg:w-3/5 border-gray-400 rounded-sm"
                >
                  <div className="relative w-full sm:w-40 md:w-48 lg:w-[200px] h-[250px] md:h-[150px] rounded-sm overflow-hidden">
                    <Image
                      src={firstProduct.image}
                      alt={firstProduct?.product_name || "img"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="text-md sm:text-xl w-full sm:ps-4">
                    <div className="flex justify-between w-full">
                      <p>
                        <span>Order ID: </span> #{order.orderId}
                      </p>
                      <p>
                        <span>Date: </span> {formatDate(order.orderCreated)}
                      </p>
                    </div>

                    <div className="py-2 space-y-1">
                      {order.products.map((prod, i) => (
                        <div key={i}>
                          <p className="py-1 w-3/5">{prod.product_name}</p>
                          <p>Price: ${prod.price?.toFixed(2)}</p>
                          <div className="flex pt-2">
                            <p>Colour: {prod.color}</p>
                            <p className="px-4">Quantity: {prod.quantity}</p>
                          </div>
                          {i !== order.products.length - 1 && (
                            <hr className="my-2 border-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedFilter == "Pending" && (
                      <div className="flex gap-4">
                        <Button
                          label="CANCEL"
                          color="blue"
                          size="md"
                          variant="outline"
                          className="!text-black py-2.5 mt-5 flex items-center gap-[10px] rounded-md"
                          onClick={() => handleOrderCancel(order)}
                        />
                        <Button
                          label="TRACK"
                          color="blue"
                          size="md"
                          variant="solid"
                          className="!bg-yellow-800 py-2.5 border border-yellow-800 mt-5 flex items-center gap-[10px] rounded-md"
                          onClick={() => handleTrackOrder(order.orderId)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;