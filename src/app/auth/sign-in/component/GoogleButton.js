"use client";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/lib/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { socialLogin as apiSocialLogin } from "@/forntend/services/authServices";
import Toast from "@/components/toastService";

const GoogleButton = () => {
  const router = useRouter();
  const auth = getAuth(app);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const body = {
          email: user.email,
          userName: user.displayName,
          loginType: "google",
        };

        try {
          const response = await apiSocialLogin(body);
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("token", JSON.stringify(response.token));
          }

          router.push("/");
        } catch (err) {
          Toast.error("Something went wrong during login");
          console.error(err);
        }
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        Toast.error("You closed the popup before completing sign-in.");
      } else {
        Toast.error("An error occurred during sign-in.");
        console.error("Google Sign-in error:", error.message);
      }
    }
  };

  return (
    <div
      onClick={signInWithGoogle}
      className="bg-white hover:bg-gray-200 w-[50px] h-[50px] flex justify-center items-center rounded-full cursor-pointer"
    >
      <FcGoogle size={32} />
    </div>
  );
};

export default GoogleButton;
