"use client";
import Image from "next/image";
import React from "react";
import { IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { BiLogoFacebook } from "react-icons/bi";
import Link from "next/link";
import GoogleLoginButton from "@/app/auth/sign-in/component/GoogleButton";
import AppleButton from "@/app/auth/sign-in/component/AppleLoginButton";
import FacebookButton from "@/app/auth/sign-in/component/FaceBookLoginButton";

function AuthCommon({
  formContent,
  heading = "Welcome Back!",
  subheading = "Log in your account",
  navigation = "Log in",
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100vh] bg-light-gray-300 w-full">
      <div className="relative w-full h-full">
        <Image
          src="/images/auth.png"
          alt="auth image"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-center">
        <div className="w-full px-10 md:px-20">
          <h2 className="font-medium font-frank bg-brand text-3xl md:text-5xl leading-[100%] pt-12 tracking-normal">
            {heading}
          </h2>
          <p className="pt-7 pb-6 md:pb-10 text-xl">{subheading}</p>

          {formContent}

          <p className="flex items-center justify-center text-lg md:text-2xl text-center py-8">
            <span className="w-9 h-0.5 bg-black mr-3" />
            Or register with...
            <span className="w-9 h-0.5 bg-black ml-3" />
          </p>

          <ul className="flex justify-center">
            <li className="px-2">
              <AppleButton />

              {/* <p
                href="#"
                className="bg-white w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full"
              >
                <IoLogoApple size={32} />
              </p> */}
            </li>
            <li className="px-2">
              <li className="px-2">
                {/* <GoogleLoginButton /> */}
                <GoogleLoginButton />
              </li>
              {/* <p
                href="#"
                className="bg-white w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full"
              >
                <FcGoogle size={32} />
              </p> */}
            </li>
            <li className="px-2">
              <FacebookButton />
            </li>
          </ul>

          <div className="text-center py-10">
            Already have an account?{" "}
            <Link
              href={navigation.to}
              className="flex justify-center sm:inline"
            >
              {/* Sign Up */} {navigation.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCommon;
