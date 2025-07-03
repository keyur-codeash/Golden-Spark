import React from "react";
import Heading from "@/components/Heading";
import { blogDetailsArticles } from "@/data/data";
import BlogCommonCard from "../../component/BlogCommonCard";

function RelatedArticles() {
  return (
    <div className="moreBlog pt-10 xl:pt-20">
      <div className="container mx-auto">
        <Heading>Related Articles</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 mt-6 md:mt-10 md:px-4 xl:px-0">
          {blogDetailsArticles.map((item, index) => (
            <BlogCommonCard items={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default RelatedArticles;
