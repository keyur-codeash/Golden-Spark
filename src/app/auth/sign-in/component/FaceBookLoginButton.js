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