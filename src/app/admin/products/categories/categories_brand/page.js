"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import Button from "@/components/Button";
import CommonModel from "@/components/Model";
import CommonTable from "@/forntend/common/CommonTable";
import Pagination from "@/forntend/common/Pagination";
import Toast from "@/components/toastService";
import { formatDate } from "@/forntend/common/commonDateFormat";

import { fetchBrand } from "@/forntend/admin/services/brandServices";
import {
  addCategoryData,
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/forntend/admin/services/catagoryServices";

import CategoryForm from "./CategoryForm";

const ProductCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
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

  useEffect(() => {
    fetchAllCategory();
  }, []);

  // Fetch Brand + Category
  useEffect(() => {
    const getAllBrand = async () => {
      const response = await fetchBrand();
      setBrand(response.data || []);
    };

    const getAllCategory = async () => {
      const response = await fetchCategory();
      setCategory(response.data || []);
    };

    getAllBrand();
    getAllCategory();
  }, []);

  // Handle form submit
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      let response;

      if (formData._id) {
        response = await updateCategory(formData);
      } else {
        response = await addCategoryData(formData);
      }
   console.log("response====", response);
   
      if (response) {
        Toast.success(response.data.message);
        setIsModalOpen(false);
        setCurrentCategory(null);
        fetchAllCategory();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit Category
  const handleCategoryEdit = (data) => {
    setCurrentCategory(data);
    setIsModalOpen(true);
  };

  // Delete Category
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteCategory(id);
      if (response) {
        Toast.success(response.message || "Category deleted successfully.");
        fetchAllCategory();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 pt-5 sm:pt-10 px-5">
        <div className="flex-wrap flex justify-between gap-y-2 items-center w-full">
          <div className="pb-2 w-auto font-bold text-gray-500 text-2xl">
            Category
          </div>

          <Button
            type="button"
            label="Add Category"
            color="blue"
            size="md"
            variant="solid"
            className="!bg-yellow-800 !rounded-0 py-3 flex items-center gap-[10px]"
            onClick={() => {
              setCurrentCategory(null);
              setIsModalOpen(true);
            }}
          />
        </div>

        {isModalOpen && (
          <CommonModel
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="max-w-2xl"
            closeIcon={false}
            maxHeight="max-h-screen"
          >
            <div className="bg-white rounded-lg px-5 w-full">
              <CategoryForm
                onClose={() => setIsModalOpen(false)}
                title={currentCategory ? "Edit Category" : "New Category"}
                initialValues={currentCategory || null}
                onSubmit={handleSubmit}
                brand={brand}
                category={category}
              />
            </div>
          </CommonModel>
        )}
      </div>

      <div className="max-h-[calc(100vh-290px)] sm:max-h-[calc(100vh-280px)] overflow-auto">
        <CommonTable
          columns={[
            { key: "id", title: "#" },
            { key: "name", title: "Name" },
            { key: "status", title: "Status" },
            { key: "createdAt", title: "Created Date" },
            { key: "Action", title: "Action" },
          ]}
        >
          {category.map((cat, index) => (
            <tr
              key={cat._id}
              className="hover:bg-gray-50 border-b text-gray-500 border-gray-300"
            >
              <td className="px-6 py-4">{index + 1}</td>

              <td className="px-6 py-4">{cat.name}</td>

              <td className="px-6 py-4">
                <span
                  className={`relative inline-block px-3 py-1 font-semibold ${
                    !cat.status ? "text-red-300" : "text-green-800"
                  } leading-tight`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 ${
                      !cat.status ? "bg-red-100" : "bg-green-200"
                    } opacity-50 rounded-full`}
                  ></span>
                  <span className="relative">
                    {!cat.status ? "Deactive" : "Active"}
                  </span>
                </span>
              </td>

              <td className="px-6 py-4">{formatDate(cat.createdAt)}</td>

              <td className="px-6 py-4">
                <div className="text-2xl flex items-center gap-x-2">
                  <HiOutlinePencilSquare
                    className="text-yellow-700 cursor-pointer"
                    onClick={() => handleCategoryEdit(cat)}
                  />

                  <AiOutlineDelete
                    className="text-red-400 cursor-pointer"
                    onClick={() => handleDelete(cat._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </CommonTable>
      </div>
    </>
  );
};

export default ProductCategories;