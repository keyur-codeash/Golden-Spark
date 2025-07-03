import React from "react";
import Button from "../Button";
import Image from "next/image";
import Accordion from "../Accordion";
import { accordionData } from "@/data/data";


function Faq() {
  return (
    <div data-aos="zoom-out">
    <div className="min-h-auto pt-14 sm:pt-20 relative ">
      <div className="container mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="flex items-center px-4 order-1 md:order-1">
            <div className="xl:pe-14">
              <h2 className="text-3xl md:text-4xl text-center lg:text-5xl 2xl:text-5xl pb-5 sm:pb-12 text-brown-900 xl:leading-16 font-medium">
                FAQ
              </h2>
              <Accordion accordionData={accordionData} />
            </div>
          </div>
          <div className="order-2 md:order-2">
            <div className="py-3 sm:py-10 h-full xl:px-0">
              <div className="relative w-full  md:h-full">
                <img
                  src="/images/faq.png"
                  alt="auth image"
                  fill
                  className="object-cover w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 xl:top-10 pt-5 w-[70px] md:w-[103px] h-[113px]">
        <Image
          src="/images/side-icon-down.png"
          alt="auth image"
          width={103}
          height={113}
          className="object-cover"
        />
      </div>
      <div>
        <div className="absolute md:top-auto top-full bottom-0 right-0 xl:bottom-0 w-[70px] md:w-[103px] h-[113px]">
          <img
            src="/images/side-icon-up.png"
            alt="auth image"
            className="object-cover"
          />
        </div>
      </div>
    </div>
    </div>
  );
}

export default Faq;
