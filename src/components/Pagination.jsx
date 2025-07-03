import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is within maxVisible
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startEllipsis = currentPage > 4;
      const endEllipsis = currentPage < totalPages - 3;

      if (!startEllipsis && endEllipsis) {
        // Beginning part
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (startEllipsis && !endEllipsis) {
        // Ending part
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle part
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-black text-gray-700 hover:bg-gray-100 disabled:opacity-40"
      >
        <HiChevronLeft className="text-xl" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2 text-gray-500 text-lg">
            ...
          </span>
        ) : (
          <button
            key={index} 
            onClick={() => onPageChange(page)}
            className={`w-9 h-9  text-sm font-medium border flex items-center cursor-pointer justify-center ${
              currentPage === page
                ? "bg-brown-800 border-brown-800 text-white"
                : " border-black"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full flex items-center cursor-pointer justify-center border border-black disabled:opacity-50"
      >
        <HiChevronRight className="text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
