"use client";
import React from "react";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { SlArrowDown } from "react-icons/sl";

const categoryList = [
  { value: "categories", label: "Categories" },
  { value: "brands", label: "Brands" },
  { value: "colors", label: "Colors" },
  { value: "sizes", label: "Sizes" },
];

function GlobalFilters({
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
}) {
  return (
    <div className="sm:flex space-y-5 sm:space-y-0 items-center sm:space-x-4 pt-5 px-2 pb-0 bg-white boder-b border-gray-50 rounded-lg">
      <div className="relative">
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="appearance-none border border-gray-300 bg-white px-4 py-2 w-full pr-8 rounded-md text-gray-700 hover:border-brown-800 focus:outline-none focus:ring-1 focus:ring-brown-800 focus:border-brown-800 transition duration-150 ease-in-out sm:w-48 sm:w-56"
          aria-label="Filter Category"
        >
          <option value="">All Categories</option>
          {categoryList?.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <IoIosArrowDown className="h-4 w-4 text-gray-500 pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2" />
      </div>

      <div
        className="flex items-center w-full bg-white border border-gray-300 rounded-md
                hover:border-brown-800 transition duration-150 ease-in-out
                focus-within:ring-1 focus-within:ring-brown-800 focus-within:border-brown-800"
      >
        <div className="p-2 pe-1">
          <IoIosSearch className="text-gray-500 text-xl" />
        </div>

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 pe-2 text-gray-700 placeholder-gray-500 bg-transparent outline-none"
          aria-label="Search items"
        />
      </div>
    </div>
  );
}

export default GlobalFilters;

// "use client";
// import React from "react";
// const categoryList = ["categories", "brands", "colors", "sizes"];
// function GlobalFilters({
//   selectedCategory,
//   setSelectedCategory,
//   search,
//   setSearch,
// }) {
//   return (
//     <div className="w-1/2 ms-auto pt-6 flex items-center gap-4 px-3 bg-white">
//       {/* Category Dropdown */}
//       <select
//         value={selectedCategory || ""}
//         onChange={(e) => setSelectedCategory(e.target.value)}
//         className="border px-3 py-2 rounded w-48"
//       >
//         <option value="">All Categories</option>
//         {categoryList?.map((cat, index) => (
//           <option key={index} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="border px-3 py-2 rounded outline-none flex-1"
//       />
//     </div>
//   );
// }

// export default GlobalFilters;
