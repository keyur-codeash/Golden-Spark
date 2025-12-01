"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/Button";
import InputField from "@/components/Input";
import { addressSchema } from "@/forntend/validation/validation";
import { fetchBrand } from "@/forntend/admin/services/brandServices";
import Dropzone from "@/forntend/common/Dropzone";
import { IoClose } from "react-icons/io5";

const ProductDetailForm = ({
  title,
  overflow,
  onClose,
  initialValues,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [descProductImage, setDescProductImage] = useState([]);
  const [brand, setBrand] = useState([]);

  console.log("descProductImage=-=----", descProductImage);

  const defaultValues = {
    title: "",
    brand: "",
    category: "",
    description: "",
    description_images: [],
  };

  useEffect(() => {
    const getAllBrand = async () => {
      const response = await fetchBrand();
      setBrand(response.data);
      setIsLoading(false);
    };
    getAllBrand();
  }, []);

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        <div
          className={
            overflow
              ? "overflow-y-auto overflow-x-hidden h-auth max-h-[70vh]"
              : ""
          }
        >
          <Formik
            initialValues={initialValues || defaultValues}
            validationSchema={addressSchema}
            onSubmit={(values) => onSubmit(values)}
          >
            {({
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                <div className="">
                  <label
                    htmlFor="title"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Title
                  </label>

                  <InputField
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter product name"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && errors.title}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Brand
                    </label>
                    <Field
                      as="select"
                      name="brand"
                      className={`w-full px-3 py-3 border ${
                        touched.brand && errors.brand
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    >
                      <option value="">Select Category</option>

                      {brand?.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </Field>

                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Category
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className={`w-full px-3 py-3 border ${
                        touched.category && errors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                    </Field>

                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <h3 className="font-medium mb-2">Product Image</h3>

                <Dropzone
                  multiple={true}
                  accept={{ "image/*": [] }}
                  onDrop={(acceptedFiles) => {
                    const newImages = acceptedFiles.map((file) =>
                      Object.assign(file, {
                        preview: URL.createObjectURL(file),
                      })
                    );

                    // update local preview
                    setDescProductImage((prev) => [...prev, ...newImages]);

                    // update Formik field
                    setFieldValue("description_images", [
                      ...values.description_images,
                      ...newImages,
                    ]);
                  }}
                >
                  {/* {({ getRootProps, getInputProps }) => (
                    <section className="border p-4 rounded-md cursor-pointer bg-gray-50">
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className="text-gray-600 text-sm text-center">
                          Drag & drop images, or click to upload
                        </p>
                      </div>
                    </section>
                  )} */}
                </Dropzone>

                {descProductImage.length > 0 && (
                  <div className="flex gap-4 flex-wrap mt-4">
                    {descProductImage.map((img, index) => (
                      <div className="relative group">
                        <div className="rounded-md p-1 border flex-wrap border-gray-300 shadow-sm bg-white">
                          <img
                            src={img.preview}
                            alt="preview"
                            className="h-16 w-16 object-cover flex-wrap rounded-md"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = descProductImage.filter(
                              (_, i) => i !== index
                            );
                            setDescProductImage(updated);
                            setFieldValue("description_images", updated);
                          }}
                          className="
                              absolute -top-2 -right-2 cursor-pointer
                              bg-red-500 text-white w-5.5 h-5.5 rounded-full
                              flex items-center justify-center text-xs font-bold
                              shadow-md border border-white
                              opacity-0 group-hover:opacity-100 transition duration-200
                            "
                        >
                          <IoClose size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ------------------ DESCRIPTION ------------------ */}
                <div className="mt-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter product description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                  />

                  {touched.description && errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    label="CANCEL"
                    variant="outline"
                    type="button"
                    onClick={onClose}
                    className="w-full border py-3.5 border-black !text-black"
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

export default ProductDetailForm;
