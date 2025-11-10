"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import BlogCommonCard from "../../component/BlogCommonCard";
import { fetchBlog } from "@/forntend/services/blogServices";
import { useParams } from "next/navigation";
import MoreBlogSkeleton from "@/forntend/skeleton/blog/MoreBlogSkeleton";

function RelatedArticles() {
  const [blogDetails, setblogDetails] = useState([]);
  const { blogId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBlogdetails = async () => {
      const response = await fetchBlog(); 
      if (response.isSuccess) {
        setblogDetails(response.data);
        setLoading(false);
      }
    };
    fetchAllBlogdetails();
  }, []);

  if (loading) {
    return (
      <div className="pt-10 md:pt-20">
        <div className="container mx-auto px-4">
          <Heading>Related Articles</Heading>
          <MoreBlogSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="moreBlog pt-10 xl:pt-20">
      <div className="container mx-auto">
        <Heading>Related Articles</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 mt-6 md:mt-10 md:px-4 xl:px-0">
          {blogDetails
            ?.filter((item) => item._id !== blogId)
            .slice(0, 3)
            .map((item) => (
              <BlogCommonCard key={item._id} items={item} />
            ))}
        </div>
      </div>
    </div>
  );
}
export default RelatedArticles;
