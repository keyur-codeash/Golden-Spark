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
  };

  return (
    <FacebookLogin
      appId="1229393372242484"
      autoLoad={false}
      fields="name,email,picture"
      scope="public_profile,email"
      callback={handleFacebookCallback}
      cssClass="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      icon="fa-facebook"
      textButton="&nbsp;&nbsp;Continue with Facebook"
      cookie={true}
      xfbml={true}
    />

    // <FacebookLogin
    //   appId="1229393372242484"
    //   autoLoad={false}
    //   fields="name,email,picture"
    //   scope="email,public_profile"
    //   callback={handleFacebookCallback}
    //   cssClass="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
    //   icon="fa-facebook"
    //   textButton="&nbsp;&nbsp;Continue with Facebook"
    // />
  );
};

export default FacebookLoginButton;
