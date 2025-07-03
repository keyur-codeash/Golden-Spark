"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../Input";
import Button from "../Button";

const SignUpForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      <InputField
        id="name"
        label="Name"
        type="text"
        placeholder="Enter your name..."
        // required
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && formik.errors.name}
      />

      <InputField
        id="email"
        label="Your Email"
        type="email"
        placeholder="Enter your email..."
        // required
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password..."
        // required
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
      />

      <div>
        <div className="pb-3 md:text-end w-full">
          <a href="#" className="text-lg hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-lg text-gray-600">Remember me</span>
        </div>
      </div>

      <Button
        type="submit"
        label="SIGN UP"
        color="blue"
        size="md"
        variant="solid"
        className="!bg-yellow-800 w-full !rounded-0 py-3.5 flex items-center gap-[10px]"
      />
    </form>
  );
};

export default SignUpForm;
