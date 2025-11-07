import React, { useEffect, useState } from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { fetchColor } from "@/forntend/services/colorServices";
import { fetchsize } from "@/forntend/services/sizeServices";
import { fetchBrand } from "@/forntend/services/brandServices";

const FilterSidebar = ({
  minPrice,
  maxPrice,
  priceRange,
  setMinPrice,
  setMaxPrice,
  onFilterChange,
  selectedFilters,
  stock,
}) => {
  const [openSections, setOpenSections] = useState({
    collection: true,
    availability: true,
    brands: true,
    sizes: true,
    colors: true,
    price: true,
  });

  const [checkedItems, setCheckedItems] = useState({
    collections: selectedFilters.collections || [],
    stock: selectedFilters.stock || false,
    outOfStock: selectedFilters.outOfStock || false,
    brands: selectedFilters.brands || [],
    sizes: selectedFilters.sizes || [],
    colors: selectedFilters.colors || [],
  });

  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleSliderChange = (values) => {
    const [newMin, newMax] = values;
    // Ensure min is not greater than max
    if (newMin > newMax) {
      setMinPrice(newMax);
      setMaxPrice(newMin);
      onFilterChange({
        minPrice: newMax,
        maxPrice: newMin,
      });
    } else {
      setMinPrice(newMin);
      setMaxPrice(newMax);
      onFilterChange({
        minPrice: newMin,
        maxPrice: newMax,
      });
    }
  };

  const handleInputChange = (index, value) => {
    const numValue = Math.max(0, +value || 0);

    if (index === 0) {
      const newMin = Math.min(numValue, priceRange[1]);
      setMinPrice(newMin);
      onFilterChange({ minPrice: newMin });
    } else {
      const newMax = Math.max(numValue, priceRange[0]);
      setMaxPrice(newMax);
      onFilterChange({ maxPrice: newMax });
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (group, value) => {
    setCheckedItems((prev) => {
      let updated;
      if (group === "stock" || group === "outOfStock") {
        if (group === "stock") {
          updated = {
            ...prev,
            stock: !prev.stock,
            outOfStock: false,
          };
        } else {
          updated = {
            ...prev,
            outOfStock: !prev.outOfStock,
            stock: false,
          };
        }
      }
      else {
        updated = prev[group].includes(value)
          ? prev[group].filter((v) => v !== value)
          : [...prev[group], value];
        updated = { ...prev, [group]: updated };
      }

      onFilterChange({
        [group]: updated[group],
        ...(group === "stock" || group === "outOfStock"
          ? {
              stock: updated.stock,
              outOfStock: updated.outOfStock,
            }
          : {}),
      });

      return updated;
    });
  };

  useEffect(() => {
    const fetchAllFilters = async () => {
      const [colorRes, sizeRes, brandRes] = await Promise.all([
        fetchColor(),
        fetchsize(),
        fetchBrand(),
      ]);
      if (colorRes?.data) setColors(colorRes.data);
      if (sizeRes?.data) setSizes(sizeRes.data);
      if (brandRes?.data) setBrands(brandRes.data);
    };
    fetchAllFilters();
  }, []);

  return (
    <div className="p-4 w-[300px] md:w-[250px] lg:w-[300px]" data-aos="fade-up">
      <h1 className="fixed lg:static top-4 left-8 z-30 text-4xl font-medium mb-10">
        Filters
      </h1>

      <FilterSection
        title="Collections"
        open={openSections.collection}
        onToggle={() => toggleSection("collection")}
      >
        {[
          "All Product",
          "Best Selling",
          "Featured Product",
          "New Arrivals",
        ].map((label, i) => {
          const value = label.toLowerCase().replace(/\s+/g, "-");
          return (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={checkedItems.collections.includes(value)}
                onChange={() => handleCheckboxChange("collections", value)}
                className="custom-checkbox"
              />
              {label}
            </label>
          );
        })}
      </FilterSection>

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
          In Stock ({stock?.inStock || 0})
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={checkedItems.outOfStock}
            onChange={() => handleCheckboxChange("outOfStock")}
            className="custom-checkbox"
          />
          Out of Stock ({stock?.outStock || 0})
        </label>
      </FilterSection>

      <FilterSection
        title="Brands"
        open={openSections.brands}
        onToggle={() => toggleSection("brands")}
      >
        {brands.map((brand) => (
          <label key={brand._id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={checkedItems.brands.includes(brand._id)}
              onChange={() => handleCheckboxChange("brands", brand._id)}
              className="custom-checkbox"
            />
            {brand.name}
          </label>
        ))}
      </FilterSection>

      <FilterSection
        title="Sizes"
        open={openSections.sizes}
        onToggle={() => toggleSection("sizes")}
      >
        <div className="flex flex-wrap gap-2">
          {sizes.map((item) => (
            <button
              key={item._id}
              onClick={() => handleCheckboxChange("sizes", item._id)}
              className={`px-4 py-1 border cursor-pointer rounded-md text-sm font-medium ${
                checkedItems.sizes.includes(item._id)
                  ? "bg-yellow-800 text-white"
                  : "text-gray-800 border-gray-400"
              }`}
            >
              {item.size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Colors"
        open={openSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color._id}
              onClick={() => handleCheckboxChange("colors", color._id)}
              className={`w-8 h-8 rounded-full border-2 ${
                checkedItems.colors.includes(color._id)
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.color }}
              aria-label={color.name}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price"
        open={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <Slider
          range
          min={priceRange[0]}
          max={priceRange[1]}
          value={[Math.min(minPrice, maxPrice), Math.max(minPrice, maxPrice)]}
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
          <div className="flex items-center">
            <span className="pe-2 font-bold">$</span>
            <input
              type="number"
              value={minPrice}
              min={priceRange[0]}
              max={priceRange[1]}
              onChange={(e) => handleInputChange(0, e.target.value)}
              className="text-center p-1 w-18 border border-gray-300 rounded-2xl text-sm"
            />
          </div>
          <div className="flex items-center">
            <span className="pe-2 font-bold">$</span>
            <input
              type="number"
              value={maxPrice}
              min={priceRange[0]}
              max={priceRange[1]}
              onChange={(e) => handleInputChange(1, e.target.value)}
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
