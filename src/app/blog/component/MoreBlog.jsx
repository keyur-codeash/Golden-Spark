import React from "react";
import BlogCommonCard from "./BlogCommonCard";
import Heading from "@/components/Heading";
import { blogArticles } from "@/data/data";

function MoreBlog() {
  return (
    <div className="moreBlog pt-10 md:pt-20">
      <Heading>More Blog</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 mt-6 md:mt-10 md:px-4 xl:px-0">
        {blogArticles.map((item, index) => (
          <BlogCommonCard items={item} />
        ))}
      </div>
    </div>
  );
}

export default MoreBlog;
