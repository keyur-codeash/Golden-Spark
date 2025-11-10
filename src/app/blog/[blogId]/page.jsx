import React from "react";
import BlogDetails from "./component/BlogDetails";
import RelatedArticles from "./component/RelatedArticles";

export async function generateStaticParams() {
  return [{ blogId: "blog-1" }, { blogId: "blog-2" }];
}

function page() {
  return (
    <div>
      <BlogDetails />
      <RelatedArticles />
    </div>
  );
}

export default page;
