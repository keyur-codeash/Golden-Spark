import Image from "next/image";
import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

const ProductCommonCard = ({ item, key }) => {
  console.log(item);

    function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); 
  const month = date.toLocaleString("en-US", { month: "short" }); 
  const year = date.getFullYear(); 

  return `${day}|${month}|${year}`;
}


  const router = useRouter();
  return (
    <div className="xl:w-full px-4">
      <div className="relative w-full h-[290px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <div className="ps-3">  
        <p className="pt-6 text-gray-500 text-lg">{formatDate(item?.createdAt)} </p>
        <h2 className="text-2xl xl:text-3xl py-4">{item.heading}</h2>
        <div className="flex">
          <p className="text-lg text-gray-500 whitespace-pre-line w-5/6">
            Where can I get some? The new site provides a closer look
          </p>
        </div>
        <Button
          label="READ MORE"
          color="blue"
          size="md"
          variant="solid"
          className="!bg-yellow-800 !rounded-0 py-3 mt-5 flex items-center gap-[10px] mb-10"
          onClick={() => router.push(`blog/${item?._id}`)}
        />
      </div>
    </div>
  );
};

export default ProductCommonCard;
