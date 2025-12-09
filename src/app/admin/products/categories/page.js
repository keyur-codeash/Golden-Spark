"use client";

import React, { useEffect, useState } from "react";
import ProductCategories from "./category/page";
import ProductBrand from "./brand/page";
import GlobalFilters from "./component/GlobalFilters";
import ProductColors from "./color/page";
import ProductSizes from "./size/page";

function Page() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="px-3">
      <GlobalFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
      />

      {/* Horizontal Scroll Wrapper */}
      <div className="overflow-x-auto ">
        <div className="grid grid-cols-4 gap-y-4  min-w-max py-3 sm:py-0">
          {/* CARD 1 */}
          <div className="min-w-80 w-full shrink-0">
            <ProductCategories
              name="Categories"
              search={
                selectedCategory === "categories" || !selectedCategory.length
                  ? search
                  : ""
              }
            />
          </div>

          {/* CARD 2 */}
          <div className="min-w-80 w-full shrink-0">
            <ProductBrand
              name="Brands"
              search={
                selectedCategory === "brands" || !selectedCategory.length
                  ? search
                  : ""
              }
              selectedCategory={selectedCategory}
            />
          </div>

          {/* CARD 3 */}
          <div className="min-w-80 w-full shrink-0">
            <ProductSizes
              name="Sizes"
              search={
                selectedCategory === "sizes" || !selectedCategory.length
                  ? search
                  : ""
              }
              selectedCategory={selectedCategory}
            />
          </div>

          {/* CARD 4 */}
          <div className="min-w-80 w-full shrink-0">
            <ProductColors
              name="Colors"
              search={
                selectedCategory === "colors" || !selectedCategory.length
                  ? search
                  : ""
              }
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;