"use client";
import React from "react";
import { useFormik } from "formik";
import InputField from "../Input";
import Button from "../Button";
import { signUp } from "@/forntend/services/authServices";
import { useRouter } from "next/navigation";
import { signUpValidation } from "@/forntend/validation/validation";
const SignUpForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: signUpValidation,
    onSubmit: async (values) => {
      try {
        const response = await signUp({
          email: values.email,
          password: values.password,
          userName: values.name,
        });

        if (response) {
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      <InputField
        id="name"
        label="Name"
        type="text"
        placeholder="Enter your name..."
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
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
      />

      <div>
        <div className="pb-3 md:text-end w-full">
          <a href="/auth/send-otp" className="text-lg hover:underline">
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
