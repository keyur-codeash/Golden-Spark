"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../Input";
import Button from "../Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/forntend/services/authServices";
import Cookies from "js-cookie";
import useToken from "@/forntend/hooks/useToken";
import { signInValidation } from "@/forntend/validation/validation";

function SignInForm() {
  const router = useRouter();
  const { token, removeToken } = useToken();

  // Check for saved credentials on component mount
  React.useEffect(() => {
    const rememberedEmail = Cookies.get("rememberedEmail");
    const rememberedPassword = Cookies.get("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
      formik.setValues({
        email: rememberedEmail,
        password: rememberedPassword,
      });
      formik.setFieldValue("rememberMe", true);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: signInValidation,
    onSubmit: async (values) => { 
      try {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });

        if (response) {
          localStorage.setItem("token", JSON.stringify(response.token));
          if (values.rememberMe) {
            Cookies.set("rememberedEmail", values.email);
            Cookies.set("rememberedPassword", values.password);
          } else {
            Cookies.remove("rememberedEmail");
            Cookies.remove("rememberedPassword");
          }

          // Redirect to home page
          router.push("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
        formik.setStatus("Login failed. Please check your credentials.");
      }
    },
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      {formik.status && (
        <div className="text-red-500 text-sm">{formik.status}</div>
      )}

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
        placeholder="Enter your password..."
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
      />

      <div>
        <div className="pb-3 md:text-end w-full">
          <Link href="/auth/send-otp" className="text-lg hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            className="h-4 w-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 text-lg text-gray-600">
            Remember me
          </label>
        </div>
      </div>

      <Button
        type="submit"
        label="LOG IN"
        color="blue"
        size="md"
        variant="solid"
        className="!bg-yellow-800 w-full !rounded-0 py-3.5 flex items-center gap-[10px]"
        disabled={formik.isSubmitting}
      />
    </form>
  );
}

export default SignInForm;