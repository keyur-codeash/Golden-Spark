"use client";
import React, { useState, useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyToken } from "@/forntend/verifyToken";
import { veifyOtp } from "@/forntend/services/authServices";

const OtpInput = ({ onSubmit }) => {
  const length = 4;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    // Get email from query parameters
    const emailParam = searchParams.get(email);
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      console.error("Email parameter is missing");
    }
  }, [searchParams]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, length);
    const digits = pasteData.split("").filter((char) => /\d/.test(char));
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      if (i < length) newOtp[i] = digit;
    });

    setOtp(newOtp);
    inputs.current[digits.length - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (otp.includes("") || otp.some((d) => d.length === 0)) {
      setError("Please enter the complete 4-digit code.");
      setIsLoading(false);
      return;
    }
    
    if (!email) {
      setError("Email address is missing. Please try again.");
      setIsLoading(false);
      return;
    }

    setError("");
    const code = otp.join("");
    
    try {
      // Verify token first
      const token = await verifyToken();
      if (!token) {
        throw new Error("Authentication failed");
      }

      // Verify OTP with the server
      const response = await veifyOtp({ email, otp: code });
      
      if (response.success) {
        router.push("/auth/forgot-password");
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "An error occurred during verification");
    } finally {
      setIsLoading(false);
    }

    if (onSubmit) onSubmit(code);
  };

  return (
    <div className="bg-yellow-400 h-screen flex justify-center items-center px-5 w-full">
      <div className="w-full" data-aos="fade-up">
        <Heading>Get Your Code</Heading>
        <p
          className="text-center py-6 text-cursom-gray-700"
          data-aos="fade-in"
          data-aos-delay="200"
        >
          Please enter the 4-digit code that was sent to {email || 'your email address'}.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mx-auto text-center mb-4"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                ref={(el) => (inputs.current[i] = el)}
                placeholder="0"
                className="w-12 h-12 bg-white text-center text-xl border border-gray-300 focus:border-yellow-500 rounded-md focus:ring-0 focus:outline-1 focus:outline-offset-0 focus:outline-yellow-500"
                disabled={isLoading}
              />
            ))}
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <Button
            label={isLoading ? "VERIFYING..." : "CONTINUE"}
            type="submit"
            color="blue"
            size="md"
            variant="solid"
            className="!bg-yellow-800 w-full !rounded-0 py-3.5 flex items-center gap-[10px]"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default OtpInput;