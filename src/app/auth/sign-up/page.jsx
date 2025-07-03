"use client"; // 👈 Ensure this is here
import React from "react";
import AuthCommon from "@/components/AuthCommon";
import SignInForm from "@/components/auth/SignInForm.js";
import SignUpFrom from "@/components/auth/SignUpFrom";

function SignUpPage() {
  return (
    <div data-aos="fade-up">
      <AuthCommon
        heading="Welcome to Golden Spark"
        subheading="Log in your account"
        formContent={<SignUpFrom />}
        navigation={{
          label: "Sign In",
          to: "sign-in",
        }}
      />
    </div>
  );
}

export default SignUpPage;
