import React from "react";
import Image from "next/image";
import Button from "../Button";
import { useRouter } from "next/navigation";

const PerfectChoice = () => {

  const router = useRouter();

  return (
    <div data-aos="zoom-in">
    <div className="perfectChoice relative ">
      <div className="container mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 lg:gap-16 xl:gap-24 h-full py-4">
          <div className="flex items-center px-4  lg:min-h-[86vh] order-2 md:order-2">
            <div className="xl:pe-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-brown-900 xl:leading-16 font-medium">
                The Perfect Choice <br /> Of Beauty.
              </h2>
              <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg  py-4 ">
                Jewellery, the exquisite fusion of craftsmanship and creativity,
                has been an integral part of human history and self-expression.
              </p>
              <Button
                label="SHOP NOW"
                color="blue"
                size="md"
                variant="solid"
                className="!bg-yellow-800 !rounded-0 py-3.5 mt-5 flex items-center gap-[10px]"
                onClick={() => {
                  router.push("/product");
                }}
              />
            </div>
          </div>
          <div className="order-1 md:order-1">
            <div className="sm:py-10 h-full xl:px-0">
              <div className="relative w-full h-[400px] md:h-[320px] lg:h-full">
                <Image
                  src="/images/perfect-choice.png"
                  alt="auth image"
                  fill
                  className="object-cover pe-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="absolute md:top-auto top-full bottom-0 right-0 xl:bottom-25 w-[80px] md:w-[103px] h-[113px]">
          <Image
            src="/images/side-icon-up.png"
            alt="auth image"
            width={103}
            height={113}
            className="object-cover"
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default PerfectChoice;
