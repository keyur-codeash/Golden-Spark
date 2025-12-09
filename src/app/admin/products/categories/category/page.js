"use client";
import React, { useEffect, useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import CommonModel from "@/components/Model";
import Toast from "@/components/toastService";
import { formatDate } from "@/forntend/common/commonDateFormat";

import {
  addCategoryData,
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/forntend/admin/services/catagoryServices";
import CategoryForm from "./CategoryForm";
import { IoAddCircleOutline } from "react-icons/io5";
import CategoryCardSkeleton from "@/forntend/skeleton/admin/CategoryCardSkeleton";

const ProductCategories = ({ name, search }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState([]);
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

  // Handle form submit
  const handleSubmit = async (formData) => {
    try {
      let response;

      if (formData._id) {
        response = await updateCategory(formData);
      } else {
        response = await addCategoryData(formData);
      }

      if (response) {
        Toast.success(
          `Category has been ${
            formData._id ? "updated" : "added"
          } successfully.`
        );
        setIsModalOpen(false);
        setCurrentCategory(null);
        fetchAllCategory();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
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

  const filteredCategory = category.filter((cat) =>
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
              <CategoryForm
                onClose={() => setIsModalOpen(false)}
                title={currentCategory ? "Edit Category" : "New Category"}
                initialValues={currentCategory || null}
                onSubmit={handleSubmit}
                category={category}
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
                setCurrentCategory(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
        {/* Category List */}
        {loading ? (
          <CategoryCardSkeleton />
        ) : (
          <div className="mt-4 overflow-auto no-scrollbar h-auto max-h-[calc(100vh-260px)] space-y-2">
            {filteredCategory.map((cat) => (
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
                        onClick={() => handleCategoryEdit(cat)}
                        className="p-1 rounded-full text-brown-800 hover:bg-brown-500 transition duration-150"
                        aria-label="Edit Category"
                      >
                        <HiOutlinePencilSquare className="text-xl cursor-pointer" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-50 transition duration-150"
                        aria-label="Delete Category"
                      >
                        <AiOutlineDelete className="text-xl cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCategory.length === 0 && (
              <p className="text-center text-gray-500 py-5">
                No categories found.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCategories;

// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { HiOutlinePencilSquare } from "react-icons/hi2";
// import { AiOutlineDelete } from "react-icons/ai";
// import Button from "@/components/Button";
// import CommonModel from "@/components/Model";
// import CommonTable from "@/forntend/common/CommonTable";
// import Pagination from "@/forntend/common/Pagination";
// import Toast from "@/components/toastService";
// import { formatDate } from "@/forntend/common/commonDateFormat";

// import {
//   addCategoryData,
//   fetchCategory,
//   updateCategory,
//   deleteCategory,
// } from "@/forntend/admin/services/catagoryServices";

// import CategoryForm from "./CategoryForm";
// import { CgAdd } from "react-icons/cg";
// import { IoAddCircleOutline } from "react-icons/io5";

// const ProductCategories = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [category, setCategory] = useState([]);
//   const [brand, setBrand] = useState([]);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch ALL categories
//   const fetchAllCategory = async () => {
//     try {
//       setLoading(true);
//       const response = await fetchCategory();
//       if (response) setCategory(response.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllCategory();
//   }, []);

//   // Fetch Brand + Category
//   useEffect(() => {
//     const getAllCategory = async () => {
//       const response = await fetchCategory();
//       setCategory(response.data || []);
//     };
//     getAllCategory();
//   }, []);

//   // Handle form submit
//   const handleSubmit = async (formData) => {
//     try {
//       setLoading(true);

//       let response;

//       if (formData._id) {
//         response = await updateCategory(formData);
//       } else {
//         response = await addCategoryData(formData);
//       }

//       if (response) {
//         Toast.success(
//           `Category has been ${
//             formData._id ? "updated" : "added"
//           } successfully.`
//         );
//         setIsModalOpen(false);
//         setCurrentCategory(null);
//         fetchAllCategory();
//       }
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit Category
//   const handleCategoryEdit = (data) => {
//     setCurrentCategory(data);
//     setIsModalOpen(true);
//   };

//   // Delete Category
//   const handleDelete = async (id) => {
//     try {
//       setLoading(true);
//       const response = await deleteCategory(id);
//       if (response) {
//         Toast.success(response.message || "Category deleted successfully.");
//         fetchAllCategory();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleStatusToggle = async (id, newStatus) => {
//     try {
//       setLoading(true);

//       const response = await updateCategory({
//         _id: id,
//         status: newStatus,
//       });

//       if (response) {
//         fetchAllCategory();
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       Toast.error("Failed to update status.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div>
//         <div className="pt-5 px-5">
//           {/* <div className="flex-wrap flex justify-between gap-y-2 items-center w-full">
//         </div> */}

//           {isModalOpen && (
//             <CommonModel
//               isOpen={isModalOpen}
//               onClose={() => setIsModalOpen(false)}
//               maxWidth="max-w-2xl"
//               closeIcon={false}
//               maxHeight="max-h-screen"
//             >
//               <div className="bg-white rounded-lg px-5 w-full">
//                 <CategoryForm
//                   onClose={() => setIsModalOpen(false)}
//                   title={currentCategory ? "Edit Category" : "New Category"}
//                   initialValues={currentCategory || null}
//                   onSubmit={handleSubmit}
//                   brand={brand}
//                   category={category}
//                 />
//               </div>
//             </CommonModel>
//           )}
//         </div>

//         <div className="w-auto">
//           <div className=" rounded-lg">
//             <div className="p-2">
//               <div className="pb-2">
//                 <div className=" text-white bg-brown-800 rounded-lg shadow-lg items-center px-4 py-5 flex justify-between">
//                   <div className=" w-auto font-bold  text-2xl">Category</div>
//                   <div>
//                     <IoAddCircleOutline
//                       className="text-3xl w-auto"
//                       onClick={() => {
//                         setCurrentCategory(null);
//                         setIsModalOpen(true);
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="overflow-auto no-scrollbar h-auto max-h-[calc(100vh-260px)] space-y-2">
//                 {category.map((cat, index) => (
//                   <div
//                     key={cat._id}
//                     className="relative rounded-lg bg-white border border-gray-200 mb-3 shadow-sm overflow-hidden hover:shadow-md transition duration-200"
//                   >
//                     {/* <div
//                       className={`absolute inset-y-0 left-0 w-1.5
//           ${cat.status ? "bg-brown-800" : "bg-gray-400"}
//         `}
//                       aria-hidden="true"
//                     ></div> */}
//                     <div className="pl-6 pr-4 py-4 flex flex-col space-y-3">
//                       <div className="flex justify-between items-start">
//                         <div className="min-w-0 flex-1">
//                           <h3 className="text-xl font-bold text-gray-800 truncate">
//                             {cat.name}
//                           </h3>
//                           <p className="text-xs text-gray-500 mt-1">
//                             <span className="font-medium">Created:</span>
//                             <span className="ml-1">
//                               {formatDate(cat.createdAt)}
//                             </span>
//                           </p>
//                         </div>
//                       </div>

//                       <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
//                         {/* Action Icons */}

//                         <span
//                           className={`text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap
//                             ${
//                               cat.status
//                                 ? "text-brown-800 bg-brown-500"
//                                 : "text-gray-600 bg-gray-200"
//                             }`}
//                         >
//                           {cat.status ? "Active" : "Draft"}
//                         </span>
//                         <div className="flex items-center ">
//                           {/* Edit */}
//                           <button
//                             onClick={() => handleCategoryEdit(cat)}
//                             className="p-1 rounded-full text-brown-800 hover:bg-brown-50 transition duration-150"
//                             aria-label="Edit Category"
//                           >
//                             <HiOutlinePencilSquare className="text-xl" />
//                           </button>
//                           {/* Delete */}
//                           <button
//                             onClick={() => handleDelete(cat._id)}
//                             className="p-1 rounded-full text-red-600 hover:bg-red-50 transition duration-150"
//                             aria-label="Delete Category"
//                           >
//                             <AiOutlineDelete className="text-xl" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductCategories;

// // "use client";
// // import React, { useEffect, useState } from "react";
// // import Image from "next/image";
// // import { HiOutlinePencilSquare } from "react-icons/hi2";
// // import { AiOutlineDelete } from "react-icons/ai";
// // import Button from "@/components/Button";
// // import CommonModel from "@/components/Model";
// // import CommonTable from "@/forntend/common/CommonTable";
// // import Pagination from "@/forntend/common/Pagination";
// // import Toast from "@/components/toastService";
// // import { formatDate } from "@/forntend/common/commonDateFormat";

// // import {
// //   addCategoryData,
// //   fetchCategory,
// //   updateCategory,
// //   deleteCategory,
// // } from "@/forntend/admin/services/catagoryServices";

// // import CategoryForm from "./CategoryForm";

// // const ProductCategories = () => {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [category, setCategory] = useState([]);
// //   const [brand, setBrand] = useState([]);
// //   const [currentCategory, setCurrentCategory] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   // Fetch ALL categories
// //   const fetchAllCategory = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetchCategory();
// //       if (response) setCategory(response.data);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAllCategory();
// //   }, []);

// //   // Fetch Brand + Category
// //   useEffect(() => {
// //     const getAllCategory = async () => {
// //       const response = await fetchCategory();
// //       setCategory(response.data || []);
// //     };
// //     getAllCategory();
// //   }, []);

// //   // Handle form submit
// //   const handleSubmit = async (formData) => {
// //     try {
// //       setLoading(true);

// //       let response;

// //       if (formData._id) {
// //         response = await updateCategory(formData);
// //       } else {
// //         response = await addCategoryData(formData);
// //       }

// //       if (response) {
// //         Toast.success(
// //           `Category has been ${
// //             formData._id ? "updated" : "added"
// //           } successfully.`
// //         );
// //         setIsModalOpen(false);
// //         setCurrentCategory(null);
// //         fetchAllCategory();
// //       }
// //     } catch (error) {
// //       console.error("Error in handleSubmit:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Edit Category
// //   const handleCategoryEdit = (data) => {
// //     setCurrentCategory(data);
// //     setIsModalOpen(true);
// //   };

// //   // Delete Category
// //   const handleDelete = async (id) => {
// //     try {
// //       setLoading(true);
// //       const response = await deleteCategory(id);
// //       if (response) {
// //         Toast.success(response.message || "Category deleted successfully.");
// //         fetchAllCategory();
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="mb-4 pt-5 sm:pt-10 px-5">
// //         <div className="flex-wrap flex justify-between gap-y-2 items-center w-full">
// //           <div className="pb-2 w-auto font-bold text-gray-500 text-2xl">
// //             Category
// //           </div>

// //           <Button
// //             type="button"
// //             label="Add Category"
// //             color="blue"
// //             size="md"
// //             variant="solid"
// //             className="!bg-yellow-800 !rounded-0 py-3 flex items-center gap-[10px]"
// //             onClick={() => {
// //               setCurrentCategory(null);
// //               setIsModalOpen(true);
// //             }}
// //           />
// //         </div>

// //         {isModalOpen && (
// //           <CommonModel
// //             isOpen={isModalOpen}
// //             onClose={() => setIsModalOpen(false)}
// //             maxWidth="max-w-2xl"
// //             closeIcon={false}
// //             maxHeight="max-h-screen"
// //           >
// //             <div className="bg-white rounded-lg px-5 w-full">
// //               <CategoryForm
// //                 onClose={() => setIsModalOpen(false)}
// //                 title={currentCategory ? "Edit Category" : "New Category"}
// //                 initialValues={currentCategory || null}
// //                 onSubmit={handleSubmit}
// //                 brand={brand}
// //                 category={category}
// //               />
// //             </div>
// //           </CommonModel>
// //         )}
// //       </div>

// //       <div className="max-h-[calc(100vh-290px)] sm:max-h-[calc(100vh-280px)] overflow-auto">
// //         <CommonTable
// //           columns={[
// //             { key: "id", title: "#" },
// //             { key: "name", title: "Name" },
// //             { key: "status", title: "Status" },
// //             { key: "createdAt", title: "Created Date" },
// //             { key: "Action", title: "Action" },
// //           ]}
// //         >
// //           {category.map((cat, index) => (
// //             <tr
// //               key={cat._id}
// //               className="hover:bg-gray-50 border-b text-gray-500 border-gray-300"
// //             >
// //               <td className="px-6 py-4">{index + 1}</td>

// //               <td className="px-6 py-4">{cat.name}</td>

// //               <td className="px-6 py-4">
// //                 <span
// //                   className={`relative inline-block px-3 py-1 font-semibold ${
// //                     !cat.status ? "text-red-300" : "text-brown-800"
// //                   } leading-tight`}
// //                 >
// //                   <span
// //                     aria-hidden
// //                     className={`absolute inset-0 ${
// //                       !cat.status ? "bg-red-100" : "bg-brown-500"
// //                     } opacity-50 rounded-full`}
// //                   ></span>
// //                   <span className="relative">
// //                     {!cat.status ? "Deactive" : "Active"}
// //                   </span>
// //                 </span>
// //               </td>

// //               <td className="px-6 py-4">{formatDate(cat.createdAt)}</td>

// //               <td className="px-6 py-4">
// //                 <div className="text-2xl flex items-center gap-x-2">
// //                   <HiOutlinePencilSquare
// //                     className="text-yellow-700 cursor-pointer"
// //                     onClick={() => handleCategoryEdit(cat)}
// //                   />

// //                   <AiOutlineDelete
// //                     className="text-red-400 cursor-pointer"
// //                     onClick={() => handleDelete(cat._id)}
// //                   />
// //                 </div>
// //               </td>
// //             </tr>
// //           ))}
// //         </CommonTable>
// //       </div>
// //     </>
// //   );
// // };

// // export default ProductCategories;
