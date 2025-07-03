import { blogDetails } from "@/data/data";
import Image from "next/image";
import React from "react";

function BlogDetails() {
  const items = {
    img: "/images/blogimg.png",
    date: "March 20, 2023",
    heading: "The Ultimate Guide to Web Development",
  };

  return (
    <div className="pt-20 px-4 xl:px-0">
      <div className="container mx-auto">
        <div className="relative w-full h-[300px] xl:h-[630px] mx-auto">
          <Image
            src="/images/blogimg.png"
            alt="img"
            fill
            className="object-cover object-top rounded-sm"
          />
        </div>
        <div className="mt-4">
          <p className="text-gray-400 text-sm sm:text-lg ">{items.date}</p>
          <h2 className="py-3 text-md md:text-xl xl:text-2xl font-medium">
            {items.heading}
          </h2>
          <p className="text-sm xl:text-xl">
            Jewellery has long been associated with classiness and beauty, yet
            it can be difficult to acquire fine items at reasonable costs. we
            think that luxury shouldn't be prohibitively expensive. You may
            shine without going over budget with our gorgeous silver jewellery
            under 2500, which offers the ideal balance of style and
            affordability.
          </p>
          <ol className="list-decimal ps-8  text-2xl font-medium">
            {blogDetails.map((item) => (
              <li key={item.id} className="pl-2 pt-8">
                <div className="-mt-8">
                  <h2 className="font-medium py-4 text-xl xl:text-2xl">
                    {item.title}
                  </h2>
                  <p className="text-sm xl:text-lg font-thin ps-0 -ml-8">
                    {item.content}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
