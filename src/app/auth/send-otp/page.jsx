"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import InputField from "@/components/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      router.push("/auth/get-otp");
      alert("Email submitted: " + values.email);
      // Here you can call your backend API
    },
  });

  return (
    <div className="bg-light-gray-300 h-screen flex justify-center items-center px-5">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-lg"
        data-aos="fade-up"
      >
        <Heading data-aos="zoom-in">Forgot Password</Heading>
        <p
          className="text-center py-6 text-cursom-gray-700"
          data-aos="fade-in"
          data-aos-delay="200"
        >
          Enter the email address associated with your account, and we’ll <br />
          send a confirmation email to reset your password.
        </p>

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

        <Button
          type="submit"
          label="CONTINUE"
          color="blue"
          size="md"
          variant="solid"
          className="!bg-yellow-800 w-full !rounded-0 py-3.5 flex items-center gap-[10px] mt-5"
          data-aos="fade-up"
          data-aos-delay="400"
        />
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
