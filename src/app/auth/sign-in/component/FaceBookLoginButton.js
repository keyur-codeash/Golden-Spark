// components/FacebookLoginButton.jsx
"use client";

import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { BiLogoFacebook } from "react-icons/bi";

const FacebookLoginButton = () => {
  const handleFacebookCallback = (response) => {
    if (!response || response.status === "unknown") {
      console.error("Facebook login failed:", response);
      return;
    }
    console.log("✅ Facebook login success:", response);
    // You can send response.accessToken to your backend here
  };

  return (
    <FacebookLogin
      appId="1873253183408656"
      autoLoad={false}
      fields="name,email,picture"
      scope="public_profile,email"
      callback={handleFacebookCallback}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="bg-white hover:bg-gray-200 w-12 h-12 flex justify-center cursor-pointer items-center rounded-full transition-colors shadow-sm focus:outline-none"
          aria-label="Login with Facebook"
        >
          <BiLogoFacebook className="text-[#1877F2]" size={28} />
        </button>
      )}
    />
  );
};

export default FacebookLoginButton;

// // components/FacebookLoginButton.jsx
// "use client";

// import React from "react";
// import FacebookLogin from "react-facebook-login";
// import { BiLogoFacebook } from "react-icons/bi";

// const FacebookLoginButton = () => {
//   const handleFacebookCallback = (response) => {
//     if (!response || response.status === "unknown") {
//       console.error("Facebook login failed.");
//       return;
//     }

//     console.log("✅ Facebook Login Success:", response);

//     // Optional: Send to backend or store in state/context
//     // const user = {
//     //   id: response.id,
//     //   name: response.name,
//     //   email: response.email,
//     //   picture: response.picture?.data?.url,
//     //   accessToken: response.accessToken,
//     // };
//   };

//   return (
//     <div className="flex justify-center items-center rounded-full cursor-pointer">
//       <FacebookLogin
//         appId="1229393372242484"
//         autoLoad={false}
//         fields="name,email,picture"
//         scope="email,public_profile,pages_show_list"
//         callback={handleFacebookCallback}
//         cssClass=""
//         render={(renderProps) => (
//           <button
//             onClick={renderProps.onClick}
//             className="bg-white w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full"
//           >
//             <BiLogoFacebook className="text-custom-blue-600" size={32} />
//           </button>
//         )}
//       />
//     </div>
//   );
// };

// export default FacebookLoginButton;

// // components/FacebookLoginButton.jsx
// "use client";

// import React from "react";
// import FacebookLogin from "react-facebook-login";

// const FacebookLoginButton = () => {
//   const handleFacebookCallback = (response) => {
//     if (!response || response.status === "unknown") {
//       console.error("Facebook login failed.");
//       return;
//     }

//     console.log("✅ Facebook Login Success:", response);

//     // Optional: Send to backend or store in state/context
//     // const user = {
//     //   id: response.id,
//     //   name: response.name,
//     //   email: response.email,
//     //   picture: response.picture?.data?.url,
//     //   accessToken: response.accessToken,
//     // };
//   };

//   return (
//     <FacebookLogin
//       appId="1229393372242484"
//       autoLoad={false}
//       fields="name,email,picture"
//       scope="email,public_profile,pages_show_list"
//       callback={handleFacebookCallback}
//       cssClass="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//       icon="fa-facebook"
//       textButton="&nbsp;&nbsp;Continue with Facebook"
//     />
//   );
// };

// export default FacebookLoginButton;

// "use client";

// import { useEffect, useState } from "react";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signInWithPopup,
//   FacebookAuthProvider,
// } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { auth, provider } from "@/lib/firebaseConfig";
// import { FaFacebook } from "react-icons/fa";
// import { BiLogoFacebook } from "react-icons/bi";

// const FacebookButton = () => {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   // useEffect(() => {
//   //   // const auth = getAuth(app);
//   //   const unsubscribe = onAuthStateChanged(auth, (user) => {
//   //     if (user) {
//   //       setUser(user);
//   //       router.push("/");
//   //     } else {
//   //       setUser(null);
//   //     }
//   //   });

//   //   return () => unsubscribe();
//   // }, [router]);

//   const signInWithFacebook = async () => {
//     await signInWithPopup(auth, provider)
//       .then((result) => {
//         setUser(result.user);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   // const signInWithFacebook = async () => {
//   //   const auth = getAuth(app);
//   //   const provider = new FacebookAuthProvider();

//   //   try {
//   //     await signInWithPopup(auth, provider);
//   //     // onAuthStateChanged will redirect after login
//   //   } catch (error) {
//   //     if (error.code === "auth/popup-closed-by-user") {
//   //       alert("You closed the popup before completing sign-in.");
//   //     } else {
//   //       console.error("Error signing in with Facebook:", error.message);
//   //       alert("An error occurred during Facebook sign-in.");
//   //     }
//   //   }
//   // };

//   return (
//     <div
//       onClick={signInWithFacebook}
//       className="flex justify-center items-center rounded-full cursor-pointer"
//     >
//       <p
//         href="#"
//         className="bg-white w-[50px] h-[50px] flex justify-center cursor-pointer items-center rounded-full"
//       >
//         <BiLogoFacebook className="text-custom-blue-600" size={32} />
//       </p>
//     </div>
//   );
// };

// export default FacebookButton;

// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //   getAuth,
// //   onAuthStateChanged,
// //   signInWithRedirect,
// //   getRedirectResult,
// //   FacebookAuthProvider,
// // } from "firebase/auth";
// // import { useRouter } from "next/navigation";
// // import app from "@/lib/firebaseConfig";
// // import { BiLogoFacebook } from "react-icons/bi";

// // const FacebookButton = () => {
// //   const [user, setUser] = useState(null);
// //   const router = useRouter();

// //   useEffect(() => {
// //     const auth = getAuth(app);

// //     // Handle redirect result
// //     getRedirectResult(auth)
// //       .then((result) => {
// //         if (result?.user) {
// //           setUser(result.user);
// //           router.push("/"); // Redirect to homepage after login
// //         }
// //       })
// //       .catch((error) => {
// //         console.error("Redirect sign-in error:", error.message);
// //         alert("An error occurred during Facebook sign-in.");
// //       });

// //     // Monitor auth state
// //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// //       if (user) {
// //         setUser(user);
// //         router.push("/");
// //       } else {
// //         setUser(null);
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, [router]);

// //   const signInWithFacebook = async () => {
// //     const auth = getAuth(app);
// //     const provider = new FacebookAuthProvider();

// //     try {
// //       await signInWithRedirect(auth, provider); // Full-page redirect
// //     } catch (error) {
// //       console.error("Error during Facebook sign-in:", error.message);
// //       alert("An error occurred during Facebook sign-in.");
// //     }
// //   };

// //   return (
// //     <div
// //       onClick={signInWithFacebook}
// //       className="flex justify-center items-center rounded-full cursor-pointer"
// //     >
// //       <div className="bg-white w-[50px] h-[50px] flex justify-center items-center rounded-full">
// //         <BiLogoFacebook className="text-custom-blue-600" size={32} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default FacebookButton;
