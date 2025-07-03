"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TbFilter } from "react-icons/tb";
import { useRouter } from "next/navigation";
import CancelOrder from "./cancel/page";
import TrackingModalPage from "./component/TrackingModalPage";
import CancelOrderModal from "./component/CancelOrderModal";
import AOS from "aos";
import "aos/dist/aos.css";

function Page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrakingModalOpen] = useState(false);
  const [orderCancelModalOpen, setOrderCancelModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const articles = [
    {
      order_id: "#904554",
      date: "18 April, 2025",
      heading: "Stone Pointed Toe Rings",
      price: 578.0,
      colour: "Gold",
      quantity: 2,
      img: "/images/latest_article_one.png",
    },
    {
      order_id: "#904554",
      date: "18 April, 2025",
      heading: "Stone Pointed Toe Rings",
      price: 578.0,
      colour: "Gold",
      quantity: 2,
      img: "/images/latest_article_one.png",
    },
    {
      order_id: "#904554",
      date: "18 April, 2025",
      heading: "Stone Pointed Toe Rings",
      price: 578.0,
      colour: "Gold",
      quantity: 2,
      img: "/images/latest_article_one.png",
    },
    {
      order_id: "#904554",
      date: "18 April, 2025",
      heading: "Stone Pointed Toe Rings",
      price: 578.0,
      colour: "Gold",
      quantity: 2,
      img: "/images/latest_article_one.png",
    },
  ];

  // Remove isFeatured filter since it's not used in the data
  const otherArticles = articles;

  return (
    <div data-aos="fade-up">
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
      <div className="container mx-auto">
        <div className="flex justify-between items-center pt-8 px-4">
          <div>
            <Heading className="!px-0">All Orders</Heading>
            <p className="pt-2">From anytime</p>
          </div>
          <div>
            <Button
              label="Filters"
              icon={<TbFilter className="text-xl" />}
              color="blue"
              size="md"
              variant="solid"
              className="!bg-brown-900 !rounded-none py-3 lg:mt-5 flex items-center gap-[10px]"
              onClick={() => router.push("/product")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:gap-7 lg:gap-5 pt-5">
          {otherArticles.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 items-start p-2 sm:p-5 border mx-4 xl:mx-0 lg:w-3/5 border-gray-400 rounded-sm"
            >
              <div className="relative w-full sm:w-40 md:w-48 lg:w-[200px] h-[250px] md:h-[150px] rounded-sm overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.heading}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-md sm:text-xl w-full sm:ps-4">
                <div className="flex justify-between w-full">
                  <p>
                    <span>Order ID: </span> {item.order_id}
                  </p>
                  <p>
                    <span>Date: </span> {item.date}
                  </p>
                </div>
                <p className="py-2">{item.heading}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="flex pt-2">
                  <p>Colour: {item.colour}</p>
                  <p className="px-4">Quantity: {item.quantity}</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    label="CANCEL"
                    color="blue"
                    size="md"
                    variant="outline"
                    className="!rounded-none !text-black py-2.5 mt-5 flex items-center gap-[10px]"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <Button
                    label="TRACK"
                    color="blue"
                    size="md"
                    variant="solid"
                    className="!rounded-none !bg-yellow-800 py-2.5 border border-yellow-800 mt-5 flex items-center gap-[10px]"
                    onClick={() => setIsTrakingModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
