import { monthfirstformatedDate } from "@/forntend/common/commonDateFormat";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCommonCard = ({ items }) => {
  return (
    <div className="px-4 sm:px-0">
      <div className="h-[250px] md:h-[250px] xl:h-[320px] w-full relative rounded-sm overflow-hidden">
        <Image
          src={items.image}
          alt="main article"
          fill
          className="object-center"
        />
      </div>
      <div className="mt-4">
        <p className="text-gray-400 text-sm sm:text-lg md:text-base ">
          {monthfirstformatedDate(items?.createdAt)}
        </p>
        <h2 className="py-3 text-md md:text-xl xl:text-xl font-medium">
          {items.heading}
        </h2>
        <Link
          href={`/blog/${items._id}`}
          className="text-gray-400 inline-block text-sm md:text-md xl:text-base border-b border-gray-400"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default BlogCommonCard;
