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
import { useRouter } from "next/navigation";
import ProductDetailForm from "./components/ProductForm";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/forntend/admin/services/productService";
import { formatDate } from "@/forntend/common/commonDateFormat";
import { fetchBrand } from "@/forntend/admin/services/brandServices";
import { fetchCategory } from "@/forntend/admin/services/catagoryServices";
import { CgAdd } from "react-icons/cg";
import { LuEye } from "react-icons/lu";

const Page = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
    limit: 8,
    totalPages: 1,
  });
  const rounter = useRouter();

  // Fetch products
  const fetchAllProduct = async (page = 1) => {
    try {
      setLoading(true);

      const response = await fetchProducts({ page, limit: pagination.limit });
      if (response) {
        setProducts(response.data);
        setPagination({
          page: response.page,
          totalItems: response.totalItems,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      }
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchAllProduct(1);
  }, [search]);

  // Handle form submit
  const handleSubmit = async (product) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("brand", product.brand);
      formData.append("category", product.category);
      formData.append("price", product.price);
      formData.append("isFeatured", product.isFeatured ? 1 : 0);
      formData.append("description", product.description);
      product?.images?.forEach((file) => {
        formData.append("images", file);
      });

      if (product.id) {
        const response = await updateProduct(product.id, formData);
        if (response) {
          Toast.success(response.message);
          setIsModalOpen(false);
          setCurrentProduct(null);
          fetchAllProduct();
        }
      } else {
        const response = await addProduct(formData);
        if (response) {
          Toast.success(response.message);
          setIsModalOpen(false);
          setCurrentProduct(null);
          fetchAllProduct();
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit Product
  const handleProductEdit = (product) => {
    brand.map((item) => {
      if (product.brand == item.name) {
        product = { ...product, brand: item._id };
      }
    });

    category.map((item) => {
      if (product.category == item.name) {
        product = { ...product, category: item._id };
      }
    });
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      setLoading(true);

      const response = await deleteProduct(id);
      if (response) {
        Toast.success(
          response.message || "Product has been removed successfully."
        );
        fetchAllProduct();
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch brand & category
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

  return (
    <>
      <div className="mb-4 pt-5 sm:pt-10 px-5">
        <div className="flex-wrap flex justify-between gap-y-2 items-center w-full">
          <div className="pb-2 w-auto font-bold text-gray-500 text-2xl">
            Products
          </div>
          <div className="">
            <Button
              type="button"
              label="Add Product"
              color="blue"
              icon={<CgAdd size={20} />}
              size="md"
              variant="solid"
              className="!bg-yellow-800 !rounded-0 py-3 flex items-center gap-[10px]"
              onClick={() => {
                setCurrentProduct(null);
                setIsModalOpen(true);
              }}
            />
          </div>
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
              <ProductDetailForm
                onClose={() => setIsModalOpen(false)}
                title={currentProduct ? "Edit Product" : "New Product"}
                initialValues={currentProduct || null}
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
            { key: "title", title: "Product" },
            { key: "brand", title: "Brand" },
            { key: "category", title: "Category" },
            { key: "isDeleted", title: "Status" },
            { key: "createdAt", title: "Created Date" },
            { key: "Action", title: "Action" },
          ]}
        >
          {products.map((product, index) => (
            <tr
              key={product._id}
              className="hover:bg-gray-50 border-b text-gray-500 border-gray-300"
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-5">
                  <div className="relative h-15 w-15">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover h-full w-full rounded-md"
                    />
                  </div>
                  <div>{product.title}</div>
                </div>
              </td>
              <td className="px-6 py-4">{product.brand}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">
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
                  <HiOutlinePencilSquare
                    className="text-brown-800 cursor-pointer"
                    onClick={() => handleProductEdit(product)}
                  />
                  <AiOutlineDelete
                    className="text-red-400 cursor-pointer"
                    onClick={() => handleDelete(product.id)}
                  />
                  <LuEye
                    className="text-blue-400 cursor-pointer"
                    onClick={() =>
                      rounter.push(`/admin/products/${product.id}`)
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </CommonTable>
      </div>

      <Pagination
        pagination={{
          page: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalItems,
          totalPages: pagination.totalPages,
          onPageChange: fetchAllProduct,
        }}
      />
    </>
  );
};

export default Page;
