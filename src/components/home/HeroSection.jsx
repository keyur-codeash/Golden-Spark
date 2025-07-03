import React from "react";
import Button from "../Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

function HeroSection() {
  const router = useRouter();

  return (
    
    <div className="min-h-auto md:h-[calc(100vh-10rem)] ">
                <div data-aos="fade-up"></div>

      <div className="container mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="flex items-center px-4 order-2 md:order-1">
            <div className="xl:pe-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-brown-900 xl:leading-16 font-medium">
                Your Enchanting Jewellery Emporium.
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
          <div className="order-1 md:order-2">
            <div className="py-10 h-full pe-6 xl:px-0">
              <div className="relative w-full h-[240px] md:h-full">
                <Image
                  src="/images/hero-bg.png"
                  alt="auth image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="md:absolute bottom-0 xl:bottom-25  pt-5 w-[80px] md:w-[103px] h-[113px]">
          <Image
            src="/images/side-icon-down.png"
            alt="auth image"
            width={103}
            height={113}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
