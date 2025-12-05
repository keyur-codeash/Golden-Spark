"use client";
import React from "react";

function GlobalFilters({ categoryList, selectedCategory, setSelectedCategory, search, setSearch }) {
  return (
    <div className="w-full flex items-center gap-4 p-3 bg-white shadow mb-4">
      {/* Category Dropdown */}
      <select
        value={selectedCategory || ""}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border px-3 py-2 rounded w-48"
      >
        <option value="">All Categories</option>
        {categoryList?.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded flex-1"
      />
    </div>
  );
}

export default GlobalFilters;
