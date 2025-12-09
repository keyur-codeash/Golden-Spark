"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import CommonModel from "@/components/Model";
import Toast from "@/components/toastService";
import { formatDate } from "@/forntend/common/commonDateFormat";

import {
  addColorData,
  fetchColor,
  updateColor,
  deleteColor,
} from "@/forntend/admin/services/colorServices";

import { IoAddCircleOutline } from "react-icons/io5";
import ColorForm from "./ColorForm";
import CategoryCardSkeleton from "@/forntend/skeleton/admin/CategoryCardSkeleton";

const ProductColors = ({ name, search }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colors, setColors] = useState([]);
  const [currentcolors, setCurrentcolors] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch ALL categories
  const fetchAllcolors = async () => {
    try {
      setLoading(true);
      const response = await fetchColor();
      if (response) setColors(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllcolors();
  }, []);

  // Handle form submit
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      let response;

      if (formData._id) {
        response = await updateColor(formData._id, {
          name: formData.name,
          status: formData.status,
          color: formData.color,
        });
      } else {
        response = await addColorData(formData);
      }

      if (response) {
        Toast.success(
          `colors has been ${formData._id ? "updated" : "added"} successfully.`
        );
        setIsModalOpen(false);
        setCurrentcolors(null);
        fetchAllcolors();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit colors
  const handlecolorsEdit = (data) => {
    setCurrentcolors(data);
    setIsModalOpen(true);
  };

  // Delete colors
  const handleDelete = async (id) => {
    try {
      const response = await deleteColor(id);
      if (response) {
        Toast.success(response.message || "colors deleted successfully.");
        fetchAllcolors();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const filteredcolors = colors?.filter((cat) =>
    cat.name?.toLowerCase().includes(search?.toLowerCase())
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
              <ColorForm
                onClose={() => setIsModalOpen(false)}
                title={currentcolors ? "Edit colors" : "New colors"}
                initialValues={currentcolors || null}
                onSubmit={handleSubmit}
                colors={colors}
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
                setCurrentcolors(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
        {/* colors List */}
        {loading ? (
          <CategoryCardSkeleton />
        ) : (
          <div className="mt-4 overflow-auto no-scrollbar h-auto max-h-[calc(100vh-260px)] space-y-2">
            {filteredcolors?.map((cat) => (
              <div
                key={cat._id}
                className="rounded-lg bg-white border border-gray-200 mb-3 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="pl-6 pr-4 py-4 flex flex-col space-y-3 ">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                          {cat.name}
                        </h3>
                        <div
                          style={{ background: cat.color }}
                          className={`h-5 w-5 rounded-sm`}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Created:</span>
                        <span className="ml-1">
                          {formatDate(cat.createdAt)}
                        </span>
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
                        onClick={() => handlecolorsEdit(cat)}
                        className="p-1 rounded-full text-brown-800 hover:bg-brown-50 transition duration-150"
                        aria-label="Edit colors"
                      >
                        <HiOutlinePencilSquare className="text-xl" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-50 transition duration-150"
                        aria-label="Delete colors"
                      >
                        <AiOutlineDelete className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredcolors.length === 0 && (
              <p className="text-center text-gray-500 py-5 border border-gray-50 shadow-md">
                No colors found.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductColors;
