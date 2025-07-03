"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../Input";
import Button from "../Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
function SignInForm() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      router.push("/");
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
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
          <Link href="send-otp" className="text-lg hover:underline">
            Forgot password?
          </Link>
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
        label="LOG IN"
        color="blue"
        size="md"
        variant="solid"
        className="!bg-yellow-800 w-full !rounded-0 py-3.5 flex items-center gap-[10px]"
      />
    </form>
  );
}

export default SignInForm;