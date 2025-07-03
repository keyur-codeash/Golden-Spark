import React, { useState } from "react";
import Filter from "../components/Filter.jsx";
import { HiOutlineX } from "react-icons/hi";
import { productData } from "@/data/data.js";
import ShoppingCard from "@/components/ShoppingCard.jsx";
import { TbFilter } from "react-icons/tb";
import Button from "@/components/Button.jsx";
import Pagination from "@/components/Pagination.jsx";

const ITEMS_PER_PAGE = 8;

const ResponsiveFilter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(productData.length / ITEMS_PER_PAGE);
  //  const  totalPages = 20;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = productData.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 lg:pt-10 relative">
        {/* Mobile Filter Button */}
        <div className="mx-4 lg:hidden">
          <Button
            label="Filters"
            icon={<TbFilter className="text-xl" />}
            color="blue"
            size="md"
            variant="solid"
            className="!bg-brown-900 !rounded-0 py-3 mt-5 flex items-center gap-[10px]"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[300px]">
          <Filter />
        </div>

        {/* Product Grid */}
        <div className="pb-10 flex-1 px-4 xl:px-0">
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10">
            {currentItems.map((item, index) => (
              <ShoppingCard
                key={index}
                image={item.image}
                text={item.text}
                price={item.price}
              />
            ))}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex justify-start items-start lg:hidden">
            <div className="relative w-[320px] max-w-full bg-brown-500 h-full shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out">
              <button
                onClick={() => setIsModalOpen(false)}
                className="fixed top-6 right-4 z-50 bg-brown-500 text-xl text-gray-600"
              >
                <HiOutlineX />
              </button>

              <div className="pt-12 pb-6 px-4 overflow-y-auto h-full relative z-40">
                <Filter />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Below Products */}
      <div className="pb-5">
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default ResponsiveFilter;