"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebaseConfig";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
    } catch (error) {
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
    </button>
  );
}
