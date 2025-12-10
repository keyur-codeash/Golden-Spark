"use client";
import Button from "@/components/Button";
import {
  addProductVariant,
  fetchProductVariant,
  fetchSingleProduct,
  updateProductVariant,
  deleteProductVariant,
} from "@/forntend/admin/services/productService";
import CommonTable from "@/forntend/common/CommonTable";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdOutlineArrowBack } from "react-icons/md";
import ProductVaraintForm from "./components/VaraintFrom";
import CommonModel from "@/components/Model";
import { fetchSize } from "@/forntend/admin/services/sizeServices";
import { fetchColor } from "@/forntend/admin/services/colorServices";
import { CgAdd } from "react-icons/cg";
import Toast from "@/components/toastService";
import { GoArrowLeft } from "react-icons/go";

function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [variants, setVariants] = useState([]);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVaraint, setCurrentVaraint] = useState({});
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const fetchVariant = async () => {
    try {
      const response = await fetchProductVariant(id);
      console.log("response=======", response);

      setVariants(response.data || []);
    } catch (error) {
      Toast.error(error);
    }
  };

  // Fetch the product data
  useEffect(() => {
    fetchVariant();
  }, [id]);
 

  // Fetch the product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetchSingleProduct(id);
        console.log("Product Response:", response);
        setProduct(response?.data);
      } catch (error) {
        Toast.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (variant) => {
    variant.productId = id;
    if (variant._id) {
      const response = await updateProductVariant(variant);
      if (response) {
        setVariants(
          variants.map((v) =>
            v._id === variant._id ? { ...v, ...variant } : v
          )
        );
        Toast.success(response.message);
        setIsModalOpen(false);
      }
    } else {
      const response = await addProductVariant(variant);
      if (response) {
        setVariants([...variants, response.data]);
        Toast.success(response.message);
        setIsModalOpen(false);
      }
    }
    fetchVariant();
  };

  const handleDeleteVariant = async (variantId) => {
    try {
      const response = await deleteProductVariant(variantId);
      if (response?.isSuccess) {
        setVariants(variants.filter((variant) => variant._id !== variantId));
        Toast.success(response.message);
      }
    } catch (error) {
      Toast.error(error.message || "Error deleting variant");
    }
  };

  const handleOpenEditVariant = (variant) => {
    setCurrentVaraint({
      ...variant,
      size: variant.size._id,
      color: variant.color._id,
    });
    setIsModalOpen(true);
  };

  console.log("variants=======", variants);

  useEffect(() => {
    const fetchAllSize = async () => {
      const response = await fetchSize();
      setSizes(response.data);
    };
    fetchAllSize();

    const fetchAllColors = async () => {
      const response = await fetchColor();
      setColors(response.data);
    };
    fetchAllColors();
  }, []);

  console.log("product========13=========", product , variants);

  return (
    <div className="px-6 py-10 h-full overflow-auto">
      {isModalOpen && (
        <CommonModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-2xl"
          closeIcon={false}
          maxHeight="max-h-screen"
        >
          <ProductVaraintForm
            onClose={() => setIsModalOpen(false)}
            title={currentVaraint ? "Edit Variant" : "New Variant"}
            initialValues={currentVaraint || null}
            onSubmit={handleSubmit}
            colors={colors}
            sizes={sizes}
          />
        </CommonModel>
      )}

      <div>
        {/* Header and Back Button */}
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-300">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center">
            <GoArrowLeft size={24}
              className="mr-3 text-lg cursor-pointer font-bold"
              onClick={() => window.history.back()}
            />
            Product Details:
          </h1>
        </div>

        <div className="!overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            {/* Image Gallery */}
            <div className="lg:col-span-1 p-4 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">
                Product Images
              </h2>
              <div className="grid grid-cols-2 gap-3  max-h-[450px] overflow-auto">
                {product?.images?.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg border border-gray-200"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.title} ${index}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Product Details Card */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {product?.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6 border-b pb-4">
                <p>
                  <strong>Brand:</strong>{" "}
                  <span className="text-gray-600">{product?.brand}</span>
                </p>
                <p>
                  <strong>Base Price:</strong>{" "}
                  <span className="font-bold text-green-600">
                    ${product?.price}
                  </span>
                </p>
                <p>
                  <strong>Product ID:</strong>{" "}
                  <span className="text-gray-500 text-sm">{product?.id}</span>
                </p>
                <p>
                  <strong>Total Variants:</strong>{" "}
                  <span className="font-bold text-blue-600">
                    {product?.variants?.length || "N/A"}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <Button
            type="button"
            label="Add Variant"
            color="blue"
            icon={<CgAdd size={20} />}
            size="md"
            variant="solid"
            className="!bg-yellow-800 !rounded-0 py-3 flex items-center gap-[10px]"
            onClick={() => {
              setCurrentVaraint(null);
              setIsModalOpen(true);
            }}
          />
        </div>

        {/* Product Variant Table */}
        <CommonTable
          columns={[
            { key: "#", title: "#" },
            { key: "size", title: "Size" },
            { key: "color", title: "Color" },
            { key: "sku", title: "SKU" },
            { key: "price", title: "Price" },
            { key: "stock", title: "Stock" },
            { key: "action", title: "Action" },
          ]}
        >
          {variants?.map((variant, index) => (
            <tr
              key={variant.id}
              className="text-gray-700 border-b border-gray-300 hover:bg-blue-50/50"
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4 font-semibold">{variant?.size?.size}</td>
              <td className="px-6 py-4 flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor: variant?.color?.color || "#f3f4f6",
                  }}
                ></span>
                {variant?.color?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {variant.sku || "N/A"}
              </td>
              <td className="px-6 py-4 font-bold">${variant.price}</td>
              <td className="px-6 py-4">
                <span
                  className={`font-bold ${
                    variant.stock > 10
                      ? "text-green-600"
                      : variant.stock > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {variant.stock}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3 text-xl">
                  <HiOutlinePencilSquare
                    className="text-blue-500 cursor-pointer hover:text-blue-700 transition"
                    onClick={() => handleOpenEditVariant(variant)}
                    title="Edit Variant"
                  />
                  <AiOutlineDelete
                    className="text-red-500 cursor-pointer hover:text-red-700 transition"
                    onClick={() => handleDeleteVariant(variant._id)}
                    title="Delete Variant"
                  />
                </div>
              </td>
            </tr>
          ))}
        </CommonTable>
      </div>
    </div>
  );
}

export default ProductDetailPage;

// "use client";
// import Button from "@/components/Button";
// import { fetchSingleProduct } from "@/forntend/admin/services/productService";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { HiOutlinePencilSquare } from "react-icons/hi2";
// import { MdOutlineArrowBack } from "react-icons/md";

// function page() {
//   const [product, setProduct] = useState({});
//   const { id } = useParams();
//   console.log(id);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetchSingleProduct(id);
//         setProduct(response.data);
//         console.log("response======", response);
//       } catch (error) {}
//     };
//     fetchProduct();
//   }, []);

//   return (
//     <div className="px-6 py-10 h-full overflow-auto">
//       <div>
//         {/* Header and Back Button */}
//         <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center">
//             <MdOutlineArrowBack
//               className="mr-3 text-2xl cursor-pointer hover:text-blue-600"
//               onClick={() => window.history.back()}
//             />
//             Product Detail:
//           </h1>

//           {/* <Button
//             label="Edit Product Info"
//             icon={<HiOutlinePencilSquare size={18} />}
//             variant="outline"
//             className="!text-blue-600 !border-blue-300"
//           /> */}
//         </div>
//         <div className="!overflow-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
//             {/* Image Gallery */}
//             <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//               <h2 className="text-xl font-semibold mb-3 text-gray-700">
//                 Product Images
//               </h2>
//               <div className="grid grid-cols-2 gap-3 w">
//                 {product?.images?.map((imgUrl, index) => (
//                   <div
//                     key={index}
//                     className="relative aspect-square rounded-lg  border border-gray-200"
//                   >
//                     <Image
//                       src={imgUrl}
//                       alt={`${product.title} ${index}`}
//                       fill
//                       style={{ objectFit: "cover" }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Main Details Card */}
//             <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//               <h2 className="text-2xl font-bold mb-4 text-gray-800">
//                 {product.title}
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6 border-b pb-4">
//                 <p>
//                   <strong>Brand:</strong>{" "}
//                   <span className="text-gray-600">{product.brand}</span>
//                 </p>
//                 <p>
//                   <strong>Base Price:</strong>{" "}
//                   <span className="font-bold text-green-600">
//                     ${product.price}
//                   </span>
//                 </p>
//                 <p>
//                   <strong>Product ID:</strong>{" "}
//                   <span className="text-gray-500 text-sm">{product.id}</span>
//                 </p>
//                 <p>
//                   <strong>Total Variants:</strong>{" "}
//                   <span className="font-bold text-blue-600"></span>
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold mb-2 text-gray-700">
//                   Description
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {product.description}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default page;
