import Image from "next/image";
import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

function ProductCommonCard({ item, key }) {
  const router = useRouter();
  return (
    <div className="xl:w-full text-center px-4">
      <div className="relative w-full h-[290px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <div className="">
        <p className="py-5 text-gray-500 text-lg">{item.date}</p>
        <h2 className="text-2xl xl:text-3xl pb-4">{item.title}</h2>
        <div className="flex justify-center">
          {" "}
          <p className="text-lg text-gray-500 whitespace-pre-line w-5/6">
            {item.description}
          </p>
        </div>
        <Button
          label="READ MORE"
          color="blue"
          size="md"
          variant="solid"
          className="!bg-yellow-800 !rounded-0 py-3 mt-5 flex items-center gap-[10px] mb-10"
          onClick={() => router.push("blog/1")}
        />
      </div>
    </div>
  );
}

export default ProductCommonCard;
