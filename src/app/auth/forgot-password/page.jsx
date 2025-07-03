"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import InputField from "@/components/Input";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-light-gray-300 h-screen flex justify-center items-center px-5">
      <div data-aos="fade-up" className="w-full max-w-md">
        <Heading>Create New Password</Heading>
        <p className="text-center text-lg py-6 text-cursom-gray-700" data-aos="fade-in">
          This password should be different from the previous password.
        </p>
        <div data-aos="fade-up" data-aos-delay="100">
          <InputField
            id="email"
            label="New Password"
            type="password"
            placeholder="Enter your password..."
            required
          />
        </div>
        <div data-aos="zoom-in" data-aos-delay="200">
          <Button
            label="CONTINUE"
            color="blue"
            size="md"
            variant="solid"
            className="!bg-yellow-800 w-full !rounded-0 py-3.5 mt-5 flex items-center gap-[10px]"
            onClick={() => {
              router.push("forgot-password/success");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
