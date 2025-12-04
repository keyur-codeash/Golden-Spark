"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/Button";
import InputField from "@/components/Input";
import { ProductCategory } from "@/forntend/validation/AdminValidation/ProductValidation";

const CategoryForm = ({
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
              setFieldError,
              isSubmitting,
            }) => {
              return (
                <Form>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                      Name
                    </label>
                    <InputField
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter product name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                  </div>

                  {/* Buttons */}
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
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
