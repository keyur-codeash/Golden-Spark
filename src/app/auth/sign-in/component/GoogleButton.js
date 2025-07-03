"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {app} from "@/lib/firebaseConfig";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle redirection
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        alert("You closed the popup before completing sign-in.");
      } else {
        console.error("Error signing in with Google:", error.message);
        alert("An error occurred during sign-in.");
      }
    }
  };

  return (
    <div
      onClick={signInWithGoogle}
      className="bg-white w-[50px] h-[50px] flex justify-center items-center rounded-full cursor-pointer"
    >
      <p className="bg-white hover:bg-gray-200 w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full">
        <FcGoogle size={32} />
      </p>
    </div>
  );
};

export default GoogleButton;

// "use client";
// import { auth, provider } from "@/lib/firebaseConfig";
// import { signInWithPopup } from "firebase/auth";
// // import { auth } from "google-auth-library";
// // import { auth, provider } from "@/lib/firebaseConfig";
// import { FcGoogle } from "react-icons/fc";

// export default function GoogleLoginButton() {
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       console.log("User info:", user);
//       // TODO: Handle redirect or save user to context/state/store
//     } catch (error) {
//       console.error("Google login failed:", error.message);
//     }
//   };

//   return (
//     <div
//       onClick={handleGoogleLogin}
//       className="bg-white w-[50px] h-[50px] flex justify-center items-center rounded-full cursor-pointer"
//     >
//       <p className="bg-white w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full">
//         <FcGoogle size={32} />
//       </p>
//     </div>
//   );
// }

// "use client";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "@/lib/firebaseConfig";
// import { FcGoogle } from "react-icons/fc";

// export default function GoogleLoginButton() {
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       console.log("User info:", user);
//       // Handle redirect or store user in context/state
//     } catch (error) {
//       console.error("Google login failed:", error.message);
//     }
//   };

//   return (
//     <div
//       onClick={handleGoogleLogin}
//       className="bg-white w-[50px] h-[50px] flex justify-center items-center rounded-full cursor-pointer"
//     >
//       <p className="bg-white w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full">
//         <FcGoogle size={32} />
//       </p>
//     </div>
//   );
// }
