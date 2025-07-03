// components/FacebookLoginButton.jsx
"use client";

import React from "react";
import FacebookLogin from "react-facebook-login";

const FacebookLoginButton = () => {
  const handleFacebookCallback = (response) => {
    if (!response || response.status === "unknown") {
      console.error("Facebook login failed.");
      return;
    }

    console.log("✅ Facebook Login Success:", response);

    // Optional: Send to backend or store in state/context
    // const user = {
    //   id: response.id,
    //   name: response.name,
    //   email: response.email,
    //   picture: response.picture?.data?.url,
    //   accessToken: response.accessToken,
    // };
  };

  return (
    <FacebookLogin
      appId="1229393372242484"
      autoLoad={false}
      fields="name,email,picture"
      scope="email,public_profile,pages_show_list"
      callback={handleFacebookCallback}
      cssClass="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      icon="fa-facebook"
      textButton="&nbsp;&nbsp;Continue with Facebook"
    />
  );
};

export default FacebookLoginButton;

// "use client";
// // pages/index.js
// import { useEffect, useState } from "react";
// import { auth, provider } from "@/lib/firebaseConfig";
// import { signInWithPopup, signOut } from "firebase/auth";

// export default function Home() {
//   const [user, setUser] = useState(null);

//   async function handleLogin() {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       console.log("User Info:", result.user);
//     } catch (error) {
//       console.error("Google Sign-In Error:", error); // This logs: auth/popup-closed-by-user
//     }
//   }

//   const handleLogout = () => {
//     signOut(auth).then(() => {
//       setUser(null);
//     });
//   };

//   return (
//     <div style={{ padding: 50, textAlign: "center" }}>
//       <h1>Login with Google</h1>
//       {!user ? (
//         <button onClick={handleLogin}>Sign in with Google</button>
//       ) : (
//         <div>
//           <p>Welcome, {user.displayName}</p>
//           <img src={user.photoURL} alt="profile" width={100} />
//           <br />
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       )}
//     </div>
//   );
// }

// // // pages/index.js
// // import Head from "next/head";
// // import GoogleLoginButton from "./component/GoogleLoginButton";
// // // import GoogleLoginButton from "../components/GoogleLoginButton";

// // export default function Home() {
// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
// //       <Head>
// //         <title>Google Login with Firebase</title>
// //       </Head>

// //       <main className="text-center space-y-6">
// //         <h1 className="text-3xl font-bold">Next.js + Firebase Google Login</h1>
// //         <GoogleLoginButton />
// //       </main>
// //     </div>
// //   );
// // }
