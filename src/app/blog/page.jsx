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

// "use client";
// import React, { useEffect, useState } from "react";
// import LatestArticle from "./component/LatestArticle";
// import MoreBlog from "./component/MoreBlog";
// import "aos/dist/aos.css";
// import AOS from "aos";
// import { fetchBlog } from "@/forntend/services/blogServices";

// function page() {
//   const [blogDetails, setblogDetails] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     AOS.init({ duration: 800, once: true });
//   }, []);

//   useEffect(() => {
//     const fetchAllBlogdetails = async () => {
//       const response = await fetchBlog();
//       if (response.isSuccess) {
//         setblogDetails(response.data);
//         setLoading(false)
//       }
//     };
//     fetchAllBlogdetails();
//   }, []);

//   return (
//     <div className="blog">
//       <div className="container mx-auto">
//         <LatestArticle
//           blogDetails={blogDetails}
//           setLoading={setLoading}
//           loading={loading}
//         />
//         <div data-aos="fade-down">
//           {blogDetails.length > 4 && (
//             <MoreBlog
//               blogDetails={blogDetails}
//               setLoading={setLoading}
//               loading={loading}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default page;
