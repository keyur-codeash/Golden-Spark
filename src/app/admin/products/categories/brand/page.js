"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import CommonModel from "@/components/Model";
import Toast from "@/components/toastService";
import { formatDate } from "@/forntend/common/commonDateFormat";

import {
  addBrandData,
  fetchBrand,
  updateBrand,
  deleteBrand,
} from "@/forntend/admin/services/brandServices";

import BrandForm from "./BrandForm";
import { IoAddCircleOutline } from "react-icons/io5";
import CategoryCardSkeleton from "@/forntend/skeleton/admin/CategoryCardSkeleton";

const ProductCategories = ({ name, search }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brand, setBrand] = useState([]);
  const [currentbrand, setCurrentbrand] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch ALL categories
  const fetchAllbrand = async () => {
    try {
      setLoading(true);
      const response = await fetchBrand();
      if (response) setBrand(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllbrand();
  }, []);

  // Handle form submit
  const handleSubmit = async (formData) => {
    try {
      let response;

      if (formData._id) {
        response = await updateBrand(formData);
      } else {
        response = await addBrandData(formData);
      }

      if (response) {
        Toast.success(
          `brand has been ${formData._id ? "updated" : "added"} successfully.`
        );
        setIsModalOpen(false);
        setCurrentbrand(null);
        fetchAllbrand();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
    }
  };

  // Edit brand
  const handlebrandEdit = (data) => {
    setCurrentbrand(data);
    setIsModalOpen(true);
  };

  // Delete brand
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteBrand(id);
      if (response) {
        Toast.success(response.message || "brand deleted successfully.");
        fetchAllbrand();
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredbrand = brand.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="pt-6 px-2">
        {/* Modal */}
        {isModalOpen && (
          <CommonModel
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="max-w-2xl"
            closeIcon={false}
            maxHeight="max-h-screen"
          >
            <div className="bg-white rounded-lg px-5 w-full">
              <BrandForm
                onClose={() => setIsModalOpen(false)}
                title={currentbrand ? "Edit brand" : "New brand"}
                initialValues={currentbrand || null}
                onSubmit={handleSubmit}
                brand={brand}
              />
            </div>
          </CommonModel>
        )}

        {/* Header Section */}
        <div className="">
          <div className="bg-brown-800 text-white rounded-lg shadow-lg px-4 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold">{name}</h2>
            <IoAddCircleOutline
              className="text-3xl cursor-pointer"
              onClick={() => {
                setCurrentbrand(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
        {/* brand List */}
        {loading ? <CategoryCardSkeleton /> :
         <div className="mt-4 overflow-auto no-scrollbar h-auto max-h-[calc(100vh-260px)] space-y-2">
          {filteredbrand.map((cat) => (
            <div
              key={cat._id}
              className="rounded-lg bg-white border border-gray-200 mb-3 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="pl-6 pr-4 py-4 flex flex-col space-y-3 ">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Created:</span>
                      <span className="ml-1">{formatDate(cat.createdAt)}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${
                      cat.status
                        ? "text-brown-800 bg-brown-500"
                        : "text-gray-600 bg-gray-200"
                    }`}
                  >
                    {cat.status ? "Active" : "Draft"}
                  </span>

                  <div className="flex items-center">
                    <button
                      onClick={() => handlebrandEdit(cat)}
                      className="p-1 rounded-full text-brown-800 hover:bg-brown-50 transition duration-150"
                      aria-label="Edit brand"
                    >
                      <HiOutlinePencilSquare className="text-xl" />
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-1 rounded-full text-red-600 hover:bg-red-50 transition duration-150"
                      aria-label="Delete brand"
                    >
                      <AiOutlineDelete className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredbrand.length === 0 && (
            <p className="text-center text-gray-500 py-5 border border-gray-50 shadow-md">
              No Brand found.
            </p>
          )}
        </div>
}
      </div>
    </>
  );
};

export default ProductCategories;
