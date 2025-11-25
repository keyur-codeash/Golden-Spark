"use client";

import React, { useEffect, useState } from "react";
import LatestArticle from "./component/LatestArticle";
import MoreBlog from "./component/MoreBlog";
import { fetchBlog } from "@/forntend/services/blogServices";

export default function BlogPage() {
  const [blogDetails, setBlogDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch blogs
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await fetchBlog();
        if (response?.isSuccess) {
          setBlogDetails(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  return (
    <div className="blog">
      <div className="container mx-auto">
        <div data-aos="fade-down">
          <LatestArticle blogDetails={blogDetails} loading={loading} />
        </div>
        <div data-aos="fade-down">
          <MoreBlog blogDetails={blogDetails} loading={loading} />
        </div>
      </div>
    </div>
  );
}