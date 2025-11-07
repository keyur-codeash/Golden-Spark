"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import InputField from "@/components/Input";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/forntend/services/authServices";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "@/forntend/verifyToken";
import { forgotPasswordSchema } from "@/forntend/validation/validation";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);


  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      const token = searchParams.get("email");
      const email = await verifyToken(token);
      
      if (email) {
        const response = await forgotPassword({
          email: email.email,
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        });
        if (response) {
          router.push("forgot-password/success");
        }
        if (onSubmit) onSubmit(code);
      }
    },
  });

  return (
    <div className=" h-screen flex justify-center items-center px-5">
      <div data-aos="fade-up">
        <div className="w-xl">
          <Heading>Create New Password</Heading>
          <p
            className="text-center text-lg py-6 text-cursom-gray-700"
            data-aos="fade-in"
          >
            This password should be different from the previous password.
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div data-aos="fade-up" data-aos-delay="100">
              <InputField
                id="password"
                name="password"
                label="New Password"
                type="password"
                placeholder="Enter your password..."
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : undefined
                }
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="150" className="mt-4">
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password..."
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : undefined
                }
              />
            </div>

            <div data-aos="zoom-in" data-aos-delay="200">
              <Button
                type="submit"
                label="CONTINUE"
                color="blue"
                size="md"
                variant="solid"
                className="!bg-yellow-800 w-full !rounded-0 py-3.5 mt-5 flex items-center gap-[10px]"
                disabled={!formik.isValid || formik.isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;