"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/Button";
import InputField from "@/components/Input";
import { productVaraintValidation } from "@/forntend/validation/AdminValidation/ProductVariantValidation";

const ProductVaraintForm = ({
  title,
  overflow,
  onClose,
  colors,
  sizes,
  initialValues,
  onSubmit,
}) => {
  const defaultValues = {
    price: "",
    stock: "",
    size: "",
    color: "",
  };

  console.log("initialValues=========", initialValues);

  const [descProductImage, setDescProductImage] = useState([]);

  /** FIX #1 — Proper useEffect OUTSIDE Formik callback */
  useEffect(() => {
    if (initialValues?.images?.length) {
      const existingImages = initialValues.images.map((img) =>
        typeof img === "string" ? img : img
      );
      setDescProductImage(existingImages);
    }
  }, [initialValues]);

  return (
    <div className="py-10 px-5">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        <div
          className={
            overflow || "overflow-y-auto overflow-x-hidden h-auth max-h-[70vh]"
          }
        >
          <Formik
            initialValues={initialValues || defaultValues}
            validationSchema={productVaraintValidation}
            enableReinitialize
            onSubmit={(values) => onSubmit(values)}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                {/* Price + Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Price
                    </label>
                    <InputField
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter product price"
                      value={values.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.price && errors.price}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Stock
                    </label>
                    <InputField
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="Enter product stock"
                      value={values.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.stock && errors.stock}
                    />
                  </div>
                </div>

                {/* Size + Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Size
                    </label>
                    <Field
                      as="select"
                      name="size"
                      className={`w-full px-3 py-3 border capitalize ${
                        touched.size && errors.size
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    >
                      <option value="" className="!capitalize">
                        select size
                      </option>
                      {sizes?.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.size}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="size"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Color
                    </label>
                    <Field
                      as="select"
                      name="color"
                      className={`w-full px-3 py-3 border capitalize ${
                        touched.color && errors.color
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    >
                      <option value="">Select color</option>
                      {colors?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="color"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    label="CANCEL"
                    variant="outline"
                    type="button"
                    onClick={onClose}
                    className="w-full border py-2.5 border-black !text-black"
                  />
                  <Button
                    label="SAVE"
                    variant="solid"
                    type="submit"
                    className="w-full !bg-yellow-800"
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProductVaraintForm;

// "use client";

// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import Button from "@/components/Button";
// import InputField from "@/components/Input";
// import { addressSchema } from "@/forntend/validation/validation";
// import Dropzone from "@/forntend/common/Dropzone";
// import { IoClose } from "react-icons/io5";
// import { productVaraintValidation } from "@/forntend/validation/AdminValidation/ProductVariantValidation";

// const ProductVaraintForm = ({
//   title,
//   overflow,
//   onClose,
//   colors,
//   sizes,
//   initialValues,
//   onSubmit,
// }) => {
//   const [descProductImage, setDescProductImage] = useState([]);

//   const defaultValues = {
//     price: "",
//     stock: "",
//     size: "",
//     color: "",
//   };

//   console.log("color size====", colors, sizes);

//   return (
//     <div className="py-10 px-5">
//       <div className="container mx-auto">
//         <h1 className="text-2xl font-bold mb-4">{title}</h1>

//         <div
//           className={
//             overflow || "overflow-y-auto overflow-x-hidden h-auth max-h-[70vh]"
//           }
//         >
//           <Formik
//             initialValues={initialValues || defaultValues}
//             validationSchema={productVaraintValidation}
//             // enableReinitialize
//             onSubmit={(values) => onSubmit(values)}
//           >
//             {({
//               values,
//               handleChange,
//               handleBlur,
//               setFieldValue,
//               errors,
//               touched,
//               setFieldError,
//               isSubmitting,
//             }) => {
//               useEffect(() => {
//                 if (initialValues?.images?.length) {
//                   const existingImages = initialValues.images.map((img) =>
//                     typeof img === "string" ? img : img
//                   );
//                   setDescProductImage(existingImages);
//                   setFieldValue("images", existingImages);
//                 }
//               }, [initialValues, setFieldValue]);

//               return (
//                 <Form>
//                   {/* Title */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-1 font-medium text-gray-700">
//                         Price
//                       </label>
//                       <InputField
//                         id="price"
//                         name="price"
//                         type="number"
//                         placeholder="Enter product price"
//                         value={values.price}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.price && errors.price}
//                       />
//                     </div>
//                     <div>
//                       <label className="block mb-1 font-medium text-gray-700">
//                         Stock
//                       </label>
//                       <InputField
//                         id="stock"
//                         name="stock"
//                         type="number"
//                         placeholder="Enter product stock"
//                         value={values.stock}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.stock && errors.stock}
//                       />
//                     </div>
//                   </div>

//                   {/* sizes & colors */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block mb-1 font-medium text-gray-700">
//                         Size
//                       </label>
//                       <Field
//                         as="select"
//                         name="size"
//                         className={`w-full px-3 py-3 border ${
//                           touched.size && errors.size
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         } rounded-md`}
//                       >
//                         <option value="">Select sizes</option>
//                         {sizes?.map((b) => (
//                           <option key={b._id} value={b._id}>
//                             {b.size}
//                           </option>
//                         ))}
//                       </Field>
//                       <ErrorMessage
//                         name="size"
//                         component="div"
//                         className="text-red-500 text-sm mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block mb-1 font-medium text-gray-700">
//                         Color
//                       </label>
//                       <Field
//                         as="select"
//                         name="color"
//                         className={`w-full px-3 py-3 border ${
//                           touched.color && errors.color
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         } rounded-md`}
//                       >
//                         <option value="">Select colors</option>
//                         {colors?.map((c) => (
//                           <option key={c._id} value={c._id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </Field>
//                       <ErrorMessage
//                         name="color"
//                         component="div"
//                         className="text-red-500 text-sm mt-1"
//                       />
//                     </div>
//                   </div>

//                   {/* Buttons */}
//                   <div className="mt-6 grid grid-cols-2 gap-4">
//                     <Button
//                       label="CANCEL"
//                       variant="outline"
//                       type="button"
//                       onClick={onClose}
//                       className="w-full border py-2.5 border-black !text-black"
//                     />
//                     <Button
//                       label="SAVE"
//                       variant="solid"
//                       type="submit"
//                       className="w-full !bg-yellow-800"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductVaraintForm;
