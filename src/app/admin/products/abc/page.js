"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdOutlineArrowBack } from "react-icons/md";
import Button from "@/components/Button";
import CommonTable from "@/forntend/common/CommonTable";
import CommonModel from "@/components/Model";
import Toast from "@/components/toastService";

const getProductData = () => ({
  id: "6879fa773e2300b131a1421c",
  title: "Necklace",
  brand: "Buccellati",
  images: [
    "http://192.168.0.111:8000/backend/product/product_1752824439077_lc9NA.png",
    "http://192.168.0.111:8000/backend/product/product_1752824439079_iDapI.png",
  ],
  price: 2000,
  description:
    "Original 24-carat golden necklace. Hand-finished with intricate detailing and certified 24-carat purity. A timeless piece of jewelry.",
  allVariants: [
    {
      id: "687a0bc33e2300b131a1473f",
      price: 2000,
      stock: 68,
      sku: "NECK-S-GOLD-01",
      color: "685297a0e8cfe630bf6c3d13",
      size: "68529024e8cfe630bf6c3d0a",
    },
    {
      id: "69259661ebfcc092e9459bd5",
      price: 2000,
      stock: 10,
      sku: "NECK-M-RED-02",
      color: "6867c3832057c2a38fbed88e",
      size: "691c38ad14bfe563a1275d72",
    },
    {
      id: "69259b87a910843654ac4aa4",
      price: 2500,
      stock: 5,
      sku: "NECK-LG-SIL-03",
      color: "685297cbe8cfe630bf6c3d15",
      size: "6853e978e81fb2ac1eac1868",
    },
    {
      id: "69259b9ea910843654ac4aa9",
      price: 2200,
      stock: 15,
      sku: "NECK-S-RED-04",
      color: "6867c3832057c2a38fbed88e",
      size: "68529024e8cfe630bf6c3d0a",
    },
  ],
  availableSizes: [
    { id: "68529024e8cfe630bf6c3d0a", name: "S" },
    { id: "691c38ad14bfe563a1275d72", name: "M" },
    { id: "6853e978e81fb2ac1eac1868", name: "LG" },
  ],
  availableColors: [
    { id: "685297a0e8cfe630bf6c3d13", name: "Gold", color: "#DEA14C" },
    { id: "685297cbe8cfe630bf6c3d15", name: "Silver", color: "#808080" },
    { id: "6867c3832057c2a38fbed88e", name: "Ruby Red", color: "#E51E25" },
  ],
});

const ProductDetailPage = ({ productId }) => {
  // Assume productId is passed via URL params
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);

  // Fetch data on mount (Simulated)
  useEffect(() => {
    setLoading(true);
    const data = getProductData();
    setProduct(data);
    setVariants(data.allVariants);
    setLoading(false);
  }, [productId]);

  // Create lookup maps for display
  const colorMap = product
    ? product.availableColors.reduce((map, c) => ({ ...map, [c.id]: c }), {})
    : {};
  const sizeMap = product
    ? product.availableSizes.reduce((map, s) => ({ ...map, [s.id]: s }), {})
    : {};

  // --- Variant CRUD Handlers (Simulated) ---
  const handleOpenAddVariant = () => {
    setCurrentVariant(null);
    setIsVariantModalOpen(true);
  };

  const handleOpenEditVariant = (variant) => {
    setCurrentVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleCloseVariantModal = () => {
    setIsVariantModalOpen(false);
    setCurrentVariant(null);
  };

  const handleSaveVariant = (variantData) => {
    console.log("Saving variant data:", variantData);

    const isNew = !variantData.id || variantData.id.startsWith("new-");

    if (isNew) {
      const newVariant = { ...variantData, id: `real-id-${Date.now()}` };
      setVariants((prev) => [...prev, newVariant]);
      Toast.success("New variant added successfully.");
    } else {
      setVariants((prev) =>
        prev.map((v) => (v.id === variantData.id ? variantData : v))
      );
      Toast.success("Variant updated successfully.");
    }
    handleCloseVariantModal();
  };

  const handleDeleteVariant = (id) => {
    if (variants.length <= 1) {
      Toast.error("Cannot delete the last variant.");
      return;
    }
    if (window.confirm("Confirm deletion of this variant.")) {
      // NOTE: Call your backend API here
      setVariants(variants.filter((v) => v.id !== id));
      Toast.success("Variant deleted successfully.");
    }
  };

  // --- UI Rendering ---

  if (loading) {
    return (
      <div className="p-10 text-center text-xl text-gray-500">
        Loading Product Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-xl text-red-500">
        Product Not Found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      {/* Header and Back Button */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center">
          <MdOutlineArrowBack
            className="mr-3 text-2xl cursor-pointer hover:text-blue-600"
            onClick={() => window.history.back()}
          />
          Product Detail: {product.title}
        </h1>
        <Button
          label="Edit Product Info"
          icon={<HiOutlinePencilSquare size={18} />}
          variant="outline"
          className="!text-blue-600 !border-blue-300"
        />
      </div>

      {/* --- Product General Details & Images --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Image Gallery */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Product Images
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {product.images.map((imgUrl, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
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

        {/* Main Details Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {product.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6 border-b pb-4">
            <p>
              <strong>Brand:</strong>{" "}
              <span className="text-gray-600">{product.brand}</span>
            </p>
            <p>
              <strong>Base Price:</strong>{" "}
              <span className="font-bold text-green-600">${product.price}</span>
            </p>
            <p>
              <strong>Product ID:</strong>{" "}
              <span className="text-gray-500 text-sm">{product.id}</span>
            </p>
            <p>
              <strong>Total Variants:</strong>{" "}
              <span className="font-bold text-blue-600">{variants.length}</span>
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

      {/* --- Variant Management Section --- */}
      {/* <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Variants Inventory
          </h2>
          <Button
            label="Add New Variant"
            icon={<AiOutlinePlus size={18} />}
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={handleOpenAddVariant}
          />
        </div>

        <CommonTable
          columns={[
            { key: "size", title: "Size" },
            { key: "color", title: "Color" },
            { key: "sku", title: "SKU" },
            { key: "price", title: "Price" },
            { key: "stock", title: "Stock" },
            { key: "action", title: "Action" },
          ]}
        >
          {variants.map((variant) => (
            <tr key={variant.id} className="text-gray-700 hover:bg-blue-50/50">
              <td className="px-6 py-4 font-semibold">
                {sizeMap[variant.size]?.name || "N/A"}
              </td>
              <td className="px-6 py-4 flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor:
                      colorMap[variant.color]?.color || "#f3f4f6",
                  }}
                ></span>
                {colorMap[variant.color]?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {variant.sku || "N/A"}
              </td>
              <td className="px-6 py-4 font-bold text-indigo-600">
                ${variant.price}
              </td>
              <td className="px-6 py-4 text-center">
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
                    onClick={() => handleDeleteVariant(variant.id)}
                    title="Delete Variant"
                  />
                </div>
              </td>
            </tr>
          ))}
        </CommonTable>
      </div> */}

      {/* --- Single Variant CRUD Modal --- */}
      <CommonModel
        isOpen={isVariantModalOpen}
        onClose={handleCloseVariantModal}
        maxWidth="max-w-lg"
      >
        {/* <ProductVariantForm
          initialVariant={currentVariant}
          availableSizes={product?.availableSizes || []}
          availableColors={product?.availableColors || []}
          onSubmit={(data) => handleSaveVariant(data)}
          onClose={handleCloseVariantModal}
        /> */}
      </CommonModel>
    </div>
  );
};

export default ProductDetailPage;

// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import Image from "next/image";
// import { HiOutlinePencilSquare } from "react-icons/hi2";
// import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
// import { CgAdd } from "react-icons/cg";
// import { FaRegEye } from "react-icons/fa";

// // --- START: PLACEHOLDER COMPONENTS ---
// // NOTE: In a real Next.js project, these would be imported from '@/components/...'

// // 1. CommonModel Placeholder
// const CommonModel = ({ isOpen, onClose, maxWidth, children, closeIcon = true }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-[100] transition-opacity p-4">
//             <div className={`bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all max-h-[95vh] ${maxWidth}`}>
//                 {closeIcon && (
//                     <button
//                         onClick={onClose}
//                         className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl z-20"
//                     >
//                         &times;
//                     </button>
//                 )}
//                 {children}
//             </div>
//         </div>
//     );
// };

// // 2. Button Placeholder
// const Button = ({ label, icon, onClick, isLoading, type = "button", className = "", variant = "solid", size = "md" }) => (
//     <button
//         onClick={onClick}
//         disabled={isLoading}
//         type={type}
//         className={`flex items-center justify-center rounded-lg font-medium transition duration-200
//           ${size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'}
//           ${variant === 'solid' ? (isLoading ? 'bg-gray-400 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white') :
//             'border border-gray-300 text-gray-700 hover:bg-gray-50'}
//           ${className}`}
//     >
//         {isLoading ? 'Loading...' : (
//             <>
//                 {icon && <span className="mr-2">{icon}</span>}
//                 {label}
//             </>
//         )}
//     </button>
// );

// // 3. CommonTable Placeholder
// const CommonTable = ({ columns, children }) => (
//     <div className="overflow-hidden border border-gray-200 rounded-xl shadow-md">
//         <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//                 <tr>
//                     {columns.map((col) => (
//                         <th
//                             key={col.key}
//                             className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
//                         >
//                             {col.title}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//                 {children}
//             </tbody>
//         </table>
//     </div>
// );

// // 4. Pagination Placeholder (Simplified)
// const Pagination = ({ pagination }) => {
//     const { page, totalPages, onPageChange } = pagination;
//     return (
//         <div className="flex justify-between items-center py-4 px-6 border-t mt-4 bg-white rounded-b-xl">
//             <span className="text-sm text-gray-600">
//                 Page {page} of {totalPages}
//             </span>
//             <div className="flex space-x-2">
//                 <Button
//                     label="Previous"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => onPageChange(page - 1)}
//                     disabled={page <= 1}
//                     className={page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
//                 />
//                 <Button
//                     label="Next"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => onPageChange(page + 1)}
//                     disabled={page >= totalPages}
//                     className={page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}
//                 />
//             </div>
//         </div>
//     );
// };

// // 5. Toast Placeholder
// const Toast = {
//     success: (message) => console.log(`[SUCCESS]: ${message}`),
//     error: (message) => console.error(`[ERROR]: ${message}`)
// };

// // 6. Data Fetching & Formatting Placeholders
// const formatDate = (date) => new Date(date).toLocaleDateString();

// // Simulating API calls with dummy data and delay
// const fetchProducts = async ({ page, limit }) => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     const totalItems = 35;
//     const totalPages = Math.ceil(totalItems / limit);
//     const startIndex = (page - 1) * limit;

//     const dummyProducts = Array.from({ length: Math.min(limit, totalItems - startIndex) }, (_, i) => ({
//         _id: `prod_${startIndex + i + 1}`,
//         title: `Product Name ${startIndex + i + 1}`,
//         brand: `Brand ${Math.floor(Math.random() * 5) + 1}`,
//         category: `Category ${Math.floor(Math.random() * 3) + 1}`,
//         isDeleted: Math.random() > 0.8,
//         createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
//         images: ["/placeholder.jpg", "/placeholder.jpg"], // Placeholder image paths
//         price: 50 + Math.floor(Math.random() * 100),
//         description: "A wonderful product.",

//         // Dummy Variant Data (for management modal)
//         allVariants: [
//             { id: "v1", price: 50, stock: 10, sku: "P-S-R", color: "685297a0e8cfe630bf6c3d13", size: "68529024e8cfe630bf6c3d0a" },
//             { id: "v2", price: 60, stock: 5, sku: "P-M-B", color: "685297cbe8cfe630bf6c3d15", size: "6853e978e81fb2ac1eac1868" },
//         ],
//         availableSizes: [
//             { id: "68529024e8cfe630bf6c3d0a", name: "S" },
//             { id: "6853e978e81fb2ac1eac1868", name: "LG" }
//         ],
//         availableColors: [
//             { id: "685297a0e8cfe630bf6c3d13", name: "Gold", color: "#DEA14C" },
//             { id: "685297cbe8cfe630bf6c3d15", name: "Silver", color: "#808080" },
//         ]
//     }));

//     return {
//         data: dummyProducts,
//         page,
//         totalItems,
//         limit,
//         totalPages,
//     };
// };
// const addProduct = async (formData) => { await new Promise(resolve => setTimeout(resolve, 500)); return { message: "Product added successfully." }; };
// const updateProduct = async (id, formData) => { await new Promise(resolve => setTimeout(resolve, 500)); return { message: "Product updated successfully." }; };
// const deleteProduct = async (id) => { await new Promise(resolve => setTimeout(resolve, 500)); return { message: "Product deleted successfully." }; };
// const fetchBrand = async () => { await new Promise(resolve => setTimeout(resolve, 100)); return { data: [{ _id: 'b1', name: 'Buccellati' }] }; };
// const fetchCategory = async () => { await new Promise(resolve => setTimeout(resolve, 100)); return { data: [{ _id: 'c1', name: 'Necklace' }] }; };
// // --- END: PLACEHOLDER COMPONENTS ---

// // =========================================================================
// // 7. ProductVariantForm Component (The modal content for single variant CRUD)
// // =========================================================================
// const ProductVariantForm = ({ initialVariant, availableSizes, availableColors, onSubmit, onClose }) => {
//     const [variantData, setVariantData] = useState(
//         initialVariant || {
//             size: availableSizes[0]?.id || "",
//             color: availableColors[0]?.id || "",
//             price: 0,
//             stock: 0,
//             sku: "",
//         }
//     );
//     const [loading, setLoading] = useState(false);
//     const isEditMode = !!initialVariant?.id && !initialVariant?.id.startsWith('new-');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setVariantData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         await onSubmit(variantData);
//         setLoading(false);
//     };

//     return (
//         <div className="p-8 bg-white rounded-xl w-full">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
//                 {isEditMode ? "Edit Variant" : "Add New Variant"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-5">

//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Size</label>
//                         <select
//                             name="size"
//                             value={variantData.size}
//                             onChange={handleChange}
//                             required
//                             className="w-full p-2.5 border border-gray-300 rounded-lg"
//                         >
//                             {availableSizes.map((s) => (
//                                 <option key={s.id} value={s.id}>{s.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Color</label>
//                         <select
//                             name="color"
//                             value={variantData.color}
//                             onChange={handleChange}
//                             required
//                             className="w-full p-2.5 border border-gray-300 rounded-lg"
//                         >
//                             {availableColors.map((c) => (
//                                 <option key={c.id} value={c.id}>{c.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
//                         <input
//                             type="number"
//                             name="price"
//                             value={variantData.price}
//                             onChange={handleChange}
//                             required
//                             min="0"
//                             step="0.01"
//                             className="w-full p-2.5 border border-gray-300 rounded-lg"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Stock Quantity</label>
//                         <input
//                             type="number"
//                             name="stock"
//                             value={variantData.stock}
//                             onChange={handleChange}
//                             required
//                             min="0"
//                             className="w-full p-2.5 border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
//                     <input
//                         type="text"
//                         name="sku"
//                         value={variantData.sku}
//                         onChange={handleChange}
//                         className="w-full p-2.5 border border-gray-300 rounded-lg"
//                         placeholder="PROD-S-RED-001"
//                     />
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t">
//                     <Button
//                       label="Cancel"
//                       variant="outline"
//                       onClick={onClose}
//                       className="text-gray-600 border-gray-300"
//                     />
//                     <Button
//                         type="submit"
//                         label={isEditMode ? "Save Changes" : "Create Variant"}
//                         icon={<AiOutlineSave size={18} />}
//                         isLoading={loading}
//                     />
//                 </div>
//             </form>
//         </div>
//     );
// };

// // =========================================================================
// // 8. ProductDetailView Component (The modal content for variant listing)
// // =========================================================================
// const ProductDetailView = ({ product, onClose, handleProductUpdate, handleVariantUpdate }) => {
//     const [variants, setVariants] = useState(product.allVariants);
//     const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
//     const [currentVariant, setCurrentVariant] = useState(null);

//     // Map objects for quick lookup
//     const colorMap = product.availableColors.reduce((map, c) => ({ ...map, [c.id]: c }), {});
//     const sizeMap = product.availableSizes.reduce((map, s) => ({ ...map, [s.id]: s }), {});

//     const handleOpenAddVariant = () => {
//         setCurrentVariant(null);
//         setIsVariantModalOpen(true);
//     };

//     const handleOpenEditVariant = (variant) => {
//         setCurrentVariant(variant);
//         setIsVariantModalOpen(true);
//     };

//     const handleCloseVariantModal = () => {
//         setIsVariantModalOpen(false);
//         setCurrentVariant(null);
//     };

//     const handleSaveVariant = async (variantData) => {
//         // --- Variant CRUD Logic (Simulated) ---
//         await new Promise(resolve => setTimeout(resolve, 500));
//         const isNew = !variantData.id || variantData.id.startsWith('temp-');

//         if (isNew) {
//             const newVariant = { ...variantData, id: `real-id-${Date.now()}` };
//             setVariants((prev) => [...prev, newVariant]);
//             Toast.success("New variant added successfully.");
//         } else {
//             setVariants((prev) =>
//                 prev.map(v => v.id === variantData.id ? variantData : v)
//             );
//             Toast.success("Variant updated successfully.");
//         }
//         handleCloseVariantModal();
//         handleVariantUpdate(); // Notify parent to refresh the main list
//     };

//     const handleDeleteVariant = (id) => {
//         if (variants.length <= 1) {
//             Toast.error("Cannot delete the last variant.");
//             return;
//         }
//         if (window.confirm("Are you sure you want to delete this variant?")) {
//             // NOTE: Call your backend API here
//             setVariants(variants.filter(v => v.id !== id));
//             Toast.success("Variant deleted successfully.");
//             handleVariantUpdate();
//         }
//     };

//     return (
//         <div className="p-8 bg-gray-50 rounded-xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-gray-50 z-10">
//                 <h2 className="text-3xl font-bold text-gray-800">
//                     Manage Variants for: {product.title}
//                 </h2>
//                 <Button
//                     label="Done Managing"
//                     className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     onClick={onClose}
//                 />
//             </div>

//             {/* --- Product Snapshot --- */}
//             <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
//                     <div className="md:col-span-1">
//                         <div className="relative h-32 w-full rounded-lg overflow-hidden border">
//                             <Image src="/placeholder.jpg" alt={product.title} fill style={{ objectFit: 'cover' }} />
//                         </div>
//                     </div>
//                     <div className="md:col-span-3 space-y-2">
//                         <p><strong>Brand:</strong> {product.brand}</p>
//                         <p><strong>Base Price:</strong> ${product.price}</p>
//                         <p><strong>Total Variants:</strong> <span className="font-bold text-blue-600">{variants.length}</span></p>
//                     </div>
//                 </div>
//             </div>

//             {/* --- Variant Listing --- */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <div className="flex justify-between items-center mb-5">
//                     <h3 className="text-2xl font-semibold text-gray-700">
//                         Variant Inventory
//                     </h3>
//                     <Button
//                         label="Add New Variant"
//                         icon={<AiOutlinePlus size={18} />}
//                         className="bg-green-600 text-white hover:bg-green-700"
//                         onClick={handleOpenAddVariant}
//                     />
//                 </div>

//                 <CommonTable
//                     columns={[
//                         { key: "size", title: "Size" },
//                         { key: "color", title: "Color" },
//                         { key: "price", title: "Price" },
//                         { key: "stock", title: "Stock" },
//                         { key: "action", title: "Action" },
//                     ]}
//                 >
//                     {variants.map((variant) => (
//                         <tr key={variant.id} className="text-gray-700">
//                             <td className="p-4">{sizeMap[variant.size]?.name || 'N/A'}</td>
//                             <td className="p-4 flex items-center gap-2">
//                                 <span
//                                     className="h-4 w-4 rounded-full border border-gray-300"
//                                     style={{ backgroundColor: colorMap[variant.color]?.color || '#f3f4f6' }}
//                                 ></span>
//                                 {colorMap[variant.color]?.name || 'N/A'}
//                             </td>
//                             <td className="p-4 font-semibold">${variant.price}</td>
//                             <td className="p-4 text-center">
//                                 <span className={variant.stock > 0 ? 'text-green-600' : 'text-red-600'}>
//                                     {variant.stock}
//                                 </span>
//                             </td>
//                             <td className="p-4">
//                                 <div className="flex items-center gap-2">
//                                     <HiOutlinePencilSquare
//                                         className="text-blue-500 cursor-pointer text-xl hover:text-blue-700 transition"
//                                         onClick={() => handleOpenEditVariant(variant)}
//                                     />
//                                     <AiOutlineDelete
//                                         className="text-red-500 cursor-pointer text-xl hover:text-red-700 transition"
//                                         onClick={() => handleDeleteVariant(variant.id)}
//                                     />
//                                 </div>
//                             </td>
//                         </tr>
//                     ))}
//                 </CommonTable>
//             </div>

//             {/* --- Single Variant CRUD Modal --- */}
//             <CommonModel
//                 isOpen={isVariantModalOpen}
//                 onClose={handleCloseVariantModal}
//                 maxWidth="max-w-md"
//             >
//                 <ProductVariantForm
//                     initialVariant={currentVariant}
//                     availableSizes={product.availableSizes}
//                     availableColors={product.availableColors}
//                     onSubmit={handleSaveVariant}
//                     onClose={handleCloseVariantModal}
//                 />
//             </CommonModel>
//         </div>
//     );
// };

// // =========================================================================
// // 9. Main ProductAdminPage Component (The core component)
// // =========================================================================
// const ProductAdminPage = () => {
//   const [search, setSearch] = useState("");
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Modals
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Add/Edit Product Modal
//   const [isVariantModalOpen, setIsVariantModalOpen] = useState(false); // Manage Variants Modal
//   const [currentProduct, setCurrentProduct] = useState(null); // Product being edited/viewed

//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalItems: 0,
//     limit: 8,
//     totalPages: 1,
//   });

//   // --- Data Fetching ---
//   const fetchAllProduct = useCallback(async (page = 1) => {
//     try {
//       setLoading(true);
//       const response = await fetchProducts({ page, limit: pagination.limit, search });
//       if (response) {
//         setProducts(response.data);
//         setPagination({
//           page: response.page,
//           totalItems: response.totalItems,
//           limit: response.limit,
//           totalPages: response.totalPages,
//         });
//       }
//     } catch (error) {
//       Toast.error("Failed to fetch products.");
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.limit, search]);

//   useEffect(() => {
//     fetchAllProduct(1);
//   }, [fetchAllProduct]);

//   // --- Handlers ---

//   // 1. Product CRUD (via Form Modal)
//   const handleAddProduct = () => {
//     setCurrentProduct(null);
//     setIsFormModalOpen(true);
//   };
//   const handleProductEdit = (product) => {
//     // Assuming pre-processing is done here if needed
//     setCurrentProduct(product);
//     setIsFormModalOpen(true);
//   };
//   const handleFormSubmit = async (product) => {
//     // NOTE: In a real implementation, you would use formData and the productService
//     try {
//       setLoading(true);
//       if (product.id) {
//         // const response = await updateProduct(product.id, product);
//         Toast.success("Product updated successfully.");
//       } else {
//         // const response = await addProduct(product);
//         Toast.success("Product added successfully.");
//       }
//     } catch (error) {
//         Toast.error("Operation failed.");
//     } finally {
//         setIsFormModalOpen(false);
//         setCurrentProduct(null);
//         fetchAllProduct(pagination.page);
//         setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       setLoading(true);
//       // const response = await deleteProduct(id);
//       Toast.success("Product removed successfully.");
//       fetchAllProduct(pagination.page);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Variant Management (via Detail Modal)
//   const handleManageVariants = (product) => {
//     setCurrentProduct(product);
//     setIsVariantModalOpen(true);
//   };

//   const handleVariantUpdate = () => {
//     // Re-fetch product list after variants are managed to update variant count
//     fetchAllProduct(pagination.page);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
//       <div className="flex-wrap flex justify-between gap-y-4 items-center w-full pb-6 border-b border-gray-200">
//         <div className="font-bold text-gray-800 text-3xl">
//           Product Management 🛍️
//         </div>
//         <div className="flex space-x-3">
//           {/* Add Product Button */}
//           <Button
//             type="button"
//             label="Add Product"
//             icon={<CgAdd size={20} />}
//             variant="solid"
//             className="!bg-indigo-600 hover:!bg-indigo-700"
//             onClick={handleAddProduct}
//           />
//         </div>
//       </div>

//       {/* Search Input (Simplified) */}
//       <div className="mt-6 mb-6">
//          <input
//             type="text"
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//           />
//       </div>

//       {/* --- Main Product Table --- */}
//       <div className="shadow-lg rounded-xl overflow-hidden">
//         <CommonTable
//           columns={[
//             { key: "id", title: "#" },
//             { key: "title", title: "Product" },
//             { key: "brand", title: "Brand" },
//             { key: "category", title: "Category" },
//             { key: "variants", title: "Variants" },
//             { key: "isDeleted", title: "Status" },
//             { key: "createdAt", title: "Created Date" },
//             { key: "Action", title: "Action" },
//           ]}
//         >
//           {loading ? (
//             <tr><td colSpan="8" className="text-center py-6 text-gray-500">Loading products...</td></tr>
//           ) : products.length === 0 ? (
//             <tr><td colSpan="8" className="text-center py-6 text-gray-500">No products found.</td></tr>
//           ) : (
//             products.map((product, index) => (
//               <tr key={product._id} className="text-gray-700 hover:bg-gray-50">
//                 <td className="px-6 py-4">{index + 1 + (pagination.page - 1) * pagination.limit}</td>
//                 <td className="px-6 py-4 font-semibold">{product.title}</td>
//                 <td className="px-6 py-4">{product.brand}</td>
//                 <td className="px-6 py-4">{product.category}</td>

//                 {/* Variant Management Button */}
//                 <td className="px-6 py-4">
//                   <Button
//                       label={`Manage (${product.allVariants?.length || 0})`}
//                       size="sm"
//                       className="!bg-green-600 hover:!bg-green-700 text-white"
//                       onClick={() => handleManageVariants(product)}
//                   />
//                 </td>

//                 <td className="px-6 py-4">
//                   <span
//                     className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
//                       product.isDeleted ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
//                     }`}
//                   >
//                     {product.isDeleted ? "Deactive" : "Active"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm">{formatDate(product.createdAt)}</td>
//                 <td className="px-6 py-4">
//                   <div className="text-xl flex items-center space-x-3">
//                     <HiOutlinePencilSquare
//                       className="text-blue-500 cursor-pointer hover:text-blue-700"
//                       onClick={() => handleProductEdit(product)}
//                     />
//                     <AiOutlineDelete
//                       className="text-red-500 cursor-pointer hover:text-red-700"
//                       onClick={() => handleDelete(product._id)}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </CommonTable>

//         {/* Pagination */}
//         <Pagination
//             pagination={{ ...pagination, onPageChange: fetchAllProduct }}
//         />
//       </div>

//       {/* --- Modal 1: Add/Edit Product Form --- */}
//       {isFormModalOpen && (
//         <CommonModel
//           isOpen={isFormModalOpen}
//           onClose={() => setIsFormModalOpen(false)}
//           maxWidth="max-w-2xl"
//         >
//           {/* NOTE: Replace this with your actual ProductDetailForm component */}
//           <div className="p-8 bg-white rounded-xl">
//              <h2 className="text-2xl font-bold mb-4">
//                 {currentProduct ? "Edit Product" : "New Product"}
//              </h2>
//              <p className="text-gray-600">Form content for general product details goes here.</p>
//              <div className="mt-6 flex justify-end">
//                 <Button label="Submit (Simulated)" onClick={() => handleFormSubmit(currentProduct)} />
//              </div>
//           </div>
//         </CommonModel>
//       )}

//       {/* --- Modal 2: Manage Variants --- */}
//       {isVariantModalOpen && currentProduct && (
//         <CommonModel
//           isOpen={isVariantModalOpen}
//           onClose={() => setIsVariantModalOpen(false)}
//           maxWidth="max-w-5xl"
//         >
//           <ProductDetailView
//             product={currentProduct}
//             onClose={() => setIsVariantModalOpen(false)}
//             handleVariantUpdate={handleVariantUpdate}
//           />
//         </CommonModel>
//       )}
//     </div>
//   );
// };

// export default ProductAdminPage;
