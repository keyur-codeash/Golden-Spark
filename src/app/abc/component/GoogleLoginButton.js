"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebaseConfig";
import { useState } from "react";
import Image from "next/image";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      // Success - handle user data
      console.log("User logged in:", result.user);
    } catch (error) {
      // Only log actual errors (ignore popup closures)
      if (error.code !== "auth/popup-closed-by-user") {
        console.error("Login error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="bg-white w-12 h-12 flex justify-center items-center rounded-full 
                hover:bg-gray-50 transition-colors disabled:opacity-70"
      aria-label="Sign in with Google"
    >
      Login
      {/* {isLoading ? (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <Image 
          src="/images/google.svg"
          alt="Google logo"
          width={24}
          height={24}
          priority
        />
      )} */}
    </button>
  );
}
