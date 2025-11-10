"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/lib/firebaseConfig";
import { IoLogoApple } from "react-icons/io5";

const AppleButton = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithApple = async () => {
    const auth = getAuth(app);
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        alert("You closed the popup before completing sign-in.");
      } else {
        console.error("Error signing in with Apple:", error.message);
        alert("An error occurred during Apple sign-in.");
      }
    }
  };

  return (
    <div
      onClick={signInWithApple}
      className=" flex justify-center items-center rounded-full cursor-pointer"
    >
      <p
        href="#"
        className="bg-white hover:bg-gray-200 w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full"
      >
        <IoLogoApple size={32} />
      </p>
    </div>
  );
};

export default AppleButton;