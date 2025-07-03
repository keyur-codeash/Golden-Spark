"use client";
import Button from "@/components/Button";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  return (
    <div className="bg-light-gray-300 min-h-screen flex justify-center items-center p-5">
      <div>
        <h2 className="font-medium font-frank bg-brand text-2xl sm:text-4xl leading-9 md:text-5xl text-center md:leading-16 tracking-normal">
          New password Confirmed <br /> Successful.
        </h2>

        <p className="text-center py-6 text-cursom-gray-700">
          You have successfully confirm your nwe password. please, use your new{" "}
          <br />
          password when login.
        </p>

        <div className=" flex justify-center py-2 md:py-8">
          <div className="relative w-[180px] h-[180px] md:w-[246px] md:h-[228px]">
            <Image
              src="/images/forgot-success.png"
              alt="auth image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <Button
          label="LOG IN"
          color="blue"
          size="md"
          variant="solid"
          className="!bg-yellow-800 w-full !rounded-0 py:3 sm:py-3.5 mt-7 flex items-center gap-[10px]"
          onClick={() => {router.push("/auth/sign-in");}}
        />
      </div>
    </div>
  );
}

export default page;
