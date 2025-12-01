"use client";
import Button from "@/components/Button";
import CommonModel from "@/components/Model";
import { fetchProducts } from "@/forntend/admin/services/productService";
import { formatDate } from "@/forntend/common/commonDateFormat";
import CommonTable from "@/forntend/common/CommonTable";
import Pagination from "@/forntend/common/Pagination";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ProductDetailForm from "./components/ProductForm";

const page = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentAddress, setCurrentAddress] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
    limit: 8,
    totalPages: 1,
  });

  const fetchAllProduct = async (page = 1) => {
    const response = await fetchProducts(pagination.page, pagination.limit);
    console.log(response);

    if (response) {
      setUsers(response.data);
      setPagination({
        page: response.page,
        total: response.totalItems,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    }
  };

  console.log("pagination=======", pagination);

  useEffect(() => {
    fetchAllProduct();
  }, [search]);

  return (
    <>
      <div className="mb-4 pt-5 sm:pt-10 px-5">
        <div className="sm:flex justify-between items-center w-full">
          <div className="pb-2 font-bold text-gray-500 w-full text-2xl">
            Products
          </div>
          <div className=" ">
            <Button
              type="submit"
              label="Add Product"
              color="blue"
              size="md"
              variant="solid"
              className="!bg-yellow-800 !rounded-0 py-3  flex items-center gap-[10px]"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

                    {isModalOpen && (
              <div className="container mx-auto">
                <CommonModel
                  isOpen={isModalOpen}
                  onClose={() => {setIsModalOpen(false)}}
                  maxWidth="max-w-2xl"
                  closeIcon={false}
                  maxHeight="max-h-screen"
                >
                  <div className="bg-white rounded-lg px-5  w-full">
                    <div className="">
                      <ProductDetailForm
                        onClose={() => {setIsModalOpen(false)}}
                        title={
                          currentAddress ? "Edit Product" : "New Product"
                        }
                        overflow={true}
                        initialValues={currentAddress || null}
                      />
                    </div>
                  </div>
                </CommonModel>
              </div>
            )}
      </div>
      <div className="max-h-[calc(100vh-320px)]  sm:max-h-[calc(100vh-280px)] overflow-auto">
        <CommonTable
          columns={[
            { key: "id", title: "#" },
            { key: "title", title: "Product" },
            { key: "brand", title: "Brand" },
            { key: "isDeleted", title: "Status" },
            { key: "createdAt", title: "Created Date" },
            { key: "Action", title: "Action" },
          ]}
        >
          {users.map((product, index) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50  border-b text-gray-500 border-gray-300"
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-5">
                  <div className="relative h-15 w-15">
                    <Image
                      src={product.images[0]}
                      alt="about"
                      fill
                      className="object-cover h-full w-full rounded-md"
                    />
                  </div>
                  <div>{product.title}</div>
                </div>
              </td>
              <td className="px-6 py-4">{product.brand}</td>
              <td className="px-6 py-4">
                {" "}
                <span
                  class={`relative inline-block px-3 py-1 font-semibold ${
                    product.isDeleted ? "text-red-300" : "text-borwn-800"
                  } leading-tight`}
                >
                  <span
                    aria-hidden
                    class={`absolute inset-0 ${
                      product.isDeleted ? "bg-red-100" : "bg-brown-500"
                    } opacity-50 rounded-full`}
                  ></span>
                  <span class="relative">
                    {product.isDeleted ? "Deactive" : "Active"}
                  </span>
                </span>
              </td>
              <td className="px-6 py-4">{formatDate(product.createdAt)}</td>
              <td className="px-6 py-4">
                <div className="text-2xl flex items-center gap-x-2">
                  <div>
                    <FaEdit className="text-brown-800" />
                  </div>
                  <div>
                    <RiDeleteBin5Fill className="text-red-400" />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </CommonTable>
      </div>
      <Pagination
        pagination={{
          page: pagination?.page || 1,
          pageSize: pagination?.limit,
          total: pagination?.totalItems,
          totalPages: pagination?.totalPages,
          onPageChange: fetchAllProduct,
        }}
      />
    </>
  );
};

export default page;
