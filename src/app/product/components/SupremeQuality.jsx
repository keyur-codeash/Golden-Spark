import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { journalData, supremeQuality } from "@/data/data";
import Image from "next/image";
import React from "react";

function SupremeQuality() {
  return (
    <div className="instagram relative sm:py-10 ">
      <div className="container mx-auto">
        <Heading >Product Supreme Quality</Heading>
        <div className="flex justify-center pb-7">
          <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 px-4 w-6xl text-center">
            Labore omnis sint totam maxime. Reprehenderit eaque consectetur
            consequuntur ullam consequuntur voluptatum. Eius voluptatem
            molestias rerum repellat quam.Eum aspernatur culpa sit saepe velit
            velit consequatur. Quia illo enim voluptas qui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {supremeQuality.map((item, index) => (
            <div className="xl:w-full text-center px-4 pb-10">
              <div className="relative w-full h-[290px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="pt-8">
                <h2 className="text-2xl xl:text-3xl pb-4">{item.title}</h2>
                <p className=" text-md sm:text-lg text-center w-full text-gray-500 whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SupremeQuality;
