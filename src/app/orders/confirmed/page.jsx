"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { fetchSingleAddress } from "@/forntend/services/addressServices";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";

const page= () => {
  const [address, setAddress] = useState({});

  useEffect(() => {
    const fetchSingleAddressDetail = async () => {
      const responce = await fetchSingleAddress();
      if (responce.isSuccess) {
        setAddress(responce.data[0]);
      }
    };
    fetchSingleAddressDetail();
  }, []);

  return (
    <div data-aos="fade-up">
      <div className="container mx-auto">
        <div className="border-1 mx-4 xl:mx-0 border-gray-300 rounded-sm p-8 mt-10 ">
          <div className="relative w-35 h-35 lg:w-45 lg:h-45 mx-auto">
            <Image
              src="/icons/order-confirmed.svg"
              alt="Checked"
              fill
              className="mx-auto"
            />
          </div>
          <Heading className="py-5">Order Confirmed</Heading>
          <p className=" md:w-2/3 lg:w-1/2 mx-auto text-center text-gray-600 pt-2">
            Your order is confirmed. You will receive an order confirmation
            email/SMS shortly with the expected delivery date for your items.
          </p>
        </div>
        <div className="mx-auto flex flex-col items-center pt-7 px-5">
          <div className=" w-full md:w-1/2">
            <Heading className="text-start !px-0 !font-normal">
              Delivery to:
            </Heading>
          </div>
          <div className="border border-gray-300 w-full rounded-sm p-6 sm:w-1/2  mt-5 sm:mt-10">
            <div className="flex items-center pb-3">
              <input type="radio" checked />
              <span className="px-4 text-xl font-bold ">{address.type}</span>
            </div>
            <div className="text-black ps-9">
              <p>
                {address.address}, {address.city}, {address.state},<br />
                {address.country}, {address.zipCode} <br />
              </p>
              <div className="pt-4">
                <p className="relative pl-6   before:content-['•'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:transform before:text-3xl before:text-black">
                  Pay on delivery available
                </p>
                <div className="pt-5">
                  <button
                    onClick={() => redirect("/orders/order-details")}
                    type="button"
                    className="text-gray-900 border flex text-lg items-center just  ify-center border-gray-800 focus:ring-0 cursor-pointer focus:outline-none font-medium rounded-sm px-4 py-2.5 text-center me-2 mb-2"
                  >
                    Order Details <GoArrowRight size={24} className="ms-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 w-full sm:w-auto sm:gap-5">
            <Button
              label="CONTINUNE SHOPPING"
              size="md"
              variant="outline"
              className="!rounded-0 py-3.5 sm:w-auto  w-full !text-black mt-5 flex items-center gap-[10px]"
              onClick={() => redirect("/product")}
            />
            <Button
              label="VIEW ACCOUNT"
              color="black"
              size="md"
              variant="solid"
              className="!bg-yellow-800 w-full sm:w-auto !rounded-0 py-3.5 mt-5 flex items-center gap-[10px]"
              onClick={() => redirect("/orders")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;