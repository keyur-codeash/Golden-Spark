"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import InputField from "@/components/Input";
import Heading from "@/components/Heading";

const GetInTouch = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      message: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .required("Message is required"),
    }),
    onSubmit: (values) => {
      // Handle form submission
      console.log("Form submitted:", values);
      // Add your API call or form handling logic here
    },
  });

  return (
    <div className="getInTouch py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Left Column - Can add image or additional content */}
          <div className="rounded-lg">
            <div className="pb-5 md:pb-5 xl:pb-10">
              <Heading className="text-start !px-0 ">Get In Touch</Heading>
            </div>
            <p className="text-gray-500 text-sm md:text-sm xl:text-md xl:text-lg">
              This form is for business inquiries. If you are a Garner member
              looking for assistance, please sign in to your Garner account. We
              do not sell product from our corporate headquarters in New York
              City. If you want to visit, please reach out to our customer
              service team first.
            </p>
          </div>
          {/* Right Column - Form */}
          <div className=" pt-0 rounded-lg">
            {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Contact Us
            </h2> */}

            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <InputField
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
              />

              <InputField
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
              />

              <InputField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />

              <div className="pb-4">
                <label className="block text-md md:text-xl text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-0 ${
                    formik.touched.message && formik.errors.message
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-black  focus:ring-black"
                  }`}
                  placeholder="Enter your message..."
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.message}
                  </p>
                )}
              </div>
              <div>
              </div>
              <Button
                type="submit"
                label="SUBMIT"
                color="primary"
                size="lg"
                variant="solid"
                className="bg-yellow-800 py-3 font-medium"
                disabled={formik.isSubmitting}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;