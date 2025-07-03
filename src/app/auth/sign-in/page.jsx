"use client"; // 👈 Ensure this is here
import React, { useEffect } from "react";
import AuthCommon from "@/components/AuthCommon";
import SignInForm from "@/components/auth/SignInForm.js";
import AOS from "aos";
import "aos/dist/aos.css";

function SignInPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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
