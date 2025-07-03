import Image from "next/image";
import Link from "next/link";
import React from "react";

function BlogCommonCard({ items }) {
  return (
    <div className="px-4 sm:px-0">
      <div className="h-[250px] md:h-[250px] xl:h-[320px] w-full relative rounded-sm overflow-hidden">
        <Image
          src={items.img}
          alt="main article"
          fill
          className="object-center"
        />
      </div>
      <div className="mt-4">
        <p className="text-gray-400 text-sm sm:text-lg ">{items.date}</p>
        <h2 className="py-3 text-md md:text-xl xl:text-2xl font-medium">
          {items.heading}
        </h2>
        <Link
          href="#"
          className="text-gray-400 inline-block text-sm md:text-md xl:text-lg border-b border-gray-400"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default BlogCommonCard;
