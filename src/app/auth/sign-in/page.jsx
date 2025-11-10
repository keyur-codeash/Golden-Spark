"use client";
import React, { useEffect } from "react";
import AuthCommon from "@/components/AuthCommon";
import SignInForm from "@/components/auth/SignInForm.js";
import AOS from "aos";
import "aos/dist/aos.css";
import useToken from "@/forntend/hooks/useToken";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const { token } = useToken();
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  if (token) {
    router.push("/");
  }

  return (
    <div data-aos="fade-up">
      <AuthCommon
        heading="Welcome Back!"
        subheading="Log in your account"
        formContent={<SignInForm />}
        navigation={{
          label: "Sign Up",
          to: "sign-up",
        }}
      />
    </div>
  );
}

export default SignInPage;
