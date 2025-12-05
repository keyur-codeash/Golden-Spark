"use client";

import React from "react";
import { Formik, Form } from "formik";
import Button from "@/components/Button";
import InputField from "@/components/Input";
import { ProductCategory } from "@/forntend/validation/AdminValidation/ProductValidation";

const BrandFrom = ({
  title,
  overflow,
  onClose,
  brand,
  category,
  initialValues,
  onSubmit,
}) => {
  const defaultValues = {
    name: "",
    status: true,
  };

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        <div
          className={
            overflow || "overflow-y-auto overflow-x-hidden h-auth max-h-[70vh]"
          }
        >
          <Formik
            initialValues={initialValues || defaultValues}
            validationSchema={ProductCategory}
            enableReinitialize
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
            }) => {
              return (
                <Form>
                  {/* Name */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                      Name
                    </label>
                    <InputField
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter category name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="mb-4 flex items-center ">
                    <label className="font-medium text-gray-700 pe-4">
                      Status :
                    </label>
                    <div>
                      <label className="relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={values.status}
                          onChange={() =>
                            setFieldValue("status", !values.status)
                          }
                        />

                        {/* Toggle Switch */}
                        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-brown-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                      </label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Button
                      label="CANCEL"
                      variant="outline"
                      type="button"
                      onClick={onClose}
                      className="w-full border py-3 border-black !text-black"
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
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BrandFrom;
