"use client";
import React, { useEffect, useState } from "react";
import ProductCategories from "./category/page";
import ProductBrand from "./brand/page";
import { fetchCategory } from "@/forntend/admin/services/catagoryServices";
import GlobalFilters from "./component/GlobalFilters";

function Page() {
  const [category, setCategory] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch ALL categories
  const fetchAllCategory = async () => {
    try {
      setLoading(true);
      const response = await fetchCategory();
      if (response) setCategory(response.data);
    } finally {
      setLoading(false);
    }
  };

  console.log("search=====", search, currentCategory);

  useEffect(() => {
    fetchAllCategory();
  }, []);

  return (
    <div className="px-3">
      {/* Global Filters */}
      <GlobalFilters
        categoryList={category}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCategories
          name="Categories"
          category={category}
          currentCategory={currentCategory}
          setCategory={setCategory}
          setCurrentCategory={setCurrentCategory}
          search={search} 
          selectedCategory={selectedCategory}
        />

        {/* <ProductBrand
          name="Brands"
          search={search}
          selectedCategory={selectedCategory}
        />
        <ProductCategories
          name="Colors"
          search={search}
          selectedCategory={selectedCategory}
        />
        <ProductCategories
          name="Sizes"
          search={search}
          selectedCategory={selectedCategory}
        /> */}
      </div>
    </div>
  );
}

export default Page;

// "use client";
// import React, { useEffect, useState } from "react";
// import ProductCategories from "./category/page";
// import ProductBrand from "./brand/page";
// import { fetchCategory } from "@/forntend/admin/services/catagoryServices";

// function page() {
//   const [category, setCategory] = useState([]);
//   const [currentCategory, setCurrentCategory] = useState(null);

//   // Fetch ALL categories
//   const fetchAllCategory = async () => {
//     try {
//       setLoading(true);
//       const response = await fetchCategory();
//       if (response) setCategory(response.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   fetchAllCategory();
//   // }, []);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-3">
//       <ProductCategories
//         name="Categories"
//         setCategory={setCategory}
//         category={category}
//         currentCategory={currentCategory}
//         setCurrentCategory={setCurrentCategory}
//       />
//       <ProductBrand name="Brands" />
//       <ProductCategories name="Colors" />
//       <ProductCategories name="Sizes" />
//     </div>
//   );
// }

// export default page;
