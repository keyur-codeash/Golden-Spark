import React, { useState } from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import Slider from "rc-slider";

// Filter options
const filterOptions = {
  collection: [
    { label: "All Product", value: "all" },
    { label: "Best Selling", value: "best" },
    { label: "Featured Product", value: "featured" },
    { label: "New Arrivals", value: "new" },
  ],
  availability: [
    { label: "In stock (10)", value: "in-stock", count: 10 },
    { label: "Out of Stock (01)", value: "out-of-stock", count: 1 },
  ],
  brands: [
    { label: "Pambraa", value: "pambraa" },
    { label: "Swarovski", value: "swarovski" },
    { label: "Buccellati", value: "buccellati" },
    { label: "David Yurman", value: "david-yurman" },
    { label: "Piaget", value: "piaget" },
  ],
  sizes: ["S", "M", "L"],
  colors: [
    { name: "Red", value: "#DBBA53" },
    { name: "Blue", value: "#C4C4C4" },
    // { name: "Green", value: "#00FF00" },
  ],
};

import "rc-slider/assets/index.css";

const FilterSidebar = ({ minPrice = 0, maxPrice = 500 }) => {
  const [openSections, setOpenSections] = useState({
    collection: true,
    availability: true,
    brands: true,
    sizes: true,
    colors: true,
    price: true,
  });

  const [checkedItems, setCheckedItems] = useState({
    collections: [],
    stock: false,
    outOfStock: false,
    brands: [],
    sizes: [],
    colors: [],
  });

  const [rangeValues, setRangeValues] = useState([minPrice, maxPrice]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (group, value) => {
    setCheckedItems((prev) => {
      if (typeof prev[group] === "boolean") {
        return { ...prev, [group]: !prev[group] };
      }
      const isChecked = prev[group].includes(value);
      const updated = isChecked
        ? prev[group].filter((v) => v !== value)
        : [...prev[group], value];
      return { ...prev, [group]: updated };
    });
  };

  const handleSliderChange = (values) => setRangeValues(values);

  return (
    <div className="p-4 w-[300px] md:w-[250px] lg:w-[300px] ">
      <h1 className="fixed lg:static  top-4 left-8 z-30  text-4xl font-medium mb-10">
        Filters
      </h1>

      {/** Collections */}
      <FilterSection
        title="Collections"
        open={openSections.collection}
        onToggle={() => toggleSection("collection")}
      >
        {filterOptions.collection.map((item) => (
          <label key={item.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={checkedItems.collections.includes(item.value)}
              onChange={() => handleCheckboxChange("collections", item.value)}
              className="custom-checkbox"
            />
            {item.label}
          </label>
        ))}
      </FilterSection>

      {/** Availability */}
      <FilterSection
        title="Availability"
        open={openSections.availability}
        onToggle={() => toggleSection("availability")}
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={checkedItems.stock}
            onChange={() => handleCheckboxChange("stock")}
            className="custom-checkbox"
          />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={checkedItems.outOfStock}
            onChange={() => handleCheckboxChange("outOfStock")}
            className="w-5 h-5 custom-checkbox"
          />
          Out of Stock
        </label>
      </FilterSection>

      {/** Brands */}
      <FilterSection
        title="Brands"
        open={openSections.brands}
        onToggle={() => toggleSection("brands")}
      >
        {filterOptions.brands.map((brand) => (
          <label key={brand.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={checkedItems.brands.includes(brand.value)}
              onChange={() => handleCheckboxChange("brands", brand.value)}
              className="custom-checkbox"
            />
            {brand.label}
          </label>
        ))}
      </FilterSection>

      {/** Sizes */}
      <FilterSection
        title="Sizes"
        open={openSections.sizes}
        onToggle={() => toggleSection("sizes")}
      >
        <div className="flex flex-wrap gap-2">
          {filterOptions.sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleCheckboxChange("sizes", size)}
              className={`px-4 py-1 border cursor-pointer rounded-md text-sm font-medium ${
                checkedItems.sizes.includes(size)
                  ? "bg-yellow-800 text-white"
                  : " text-gray-800 border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/** Colors */}
      <FilterSection
        title="Colors"
        open={openSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        <div className="flex flex-wrap gap-3">
          {filterOptions.colors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleCheckboxChange("colors", color.value)}
              className={`w-8 h-8 rounded-full border-2 ${
                checkedItems.colors.includes(color.value)
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
            />
          ))}
        </div>
      </FilterSection>

      {/** Price */}
      <FilterSection
        title="Price"
        open={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <Slider
          range
          min={minPrice}
          max={maxPrice}
          value={rangeValues}
          onChange={handleSliderChange}
          trackStyle={[{ backgroundColor: "#000", height: "5px" }]}
          handleStyle={[
            {
              backgroundColor: "#000",
              borderColor: "#000",
              height: 15,
              width: 15,
            },
            {
              backgroundColor: "#000",
              borderColor: "#000",
              height: 15,
              width: 15,
            },
          ]}
          railStyle={{ backgroundColor: "#ddd", height: "5px" }}
        />
        <div className="mt-2 flex gap-4">
          <div className="flex justify-center items-center">
            <span className="pe-2 text-bold">$</span>
            <input
              type="number"
              value={rangeValues[0]}
              onChange={(e) =>
                setRangeValues([+e.target.value, rangeValues[1]])
              }
              className="text-center p-1 w-18 border border-gray-300 rounded-2xl text-sm"
            />
          </div>
          <div className="flex justify-center items-center">
            <span className="pe-2 text-bold">$</span>
            <input
              type="number"
              value={rangeValues[1]}
              onChange={(e) =>
                setRangeValues([rangeValues[0], +e.target.value])
              }
              className="text-center p-1 w-18 border border-gray-300 rounded-2xl text-sm"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="mb-5">
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <h2 className="text-lg font-medium">{title}</h2>
      {open ? <HiOutlineMinus /> : <HiOutlinePlus />}
    </div>
    {open && <div className="mt-2 flex flex-col gap-2">{children}</div>}
  </div>
);

export default FilterSidebar;