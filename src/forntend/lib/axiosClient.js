"use client";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
});

// Add interceptor
axiosInstance.interceptors.request.use((config) => {
  const protectedRoutes = [
    "/user",
    "/orders",
    "/cart",
    "/product/wishlist",
    "/wishlist",
    "/address",
    "/payment",
    "/order",
  ];
  let token = null;
  if (typeof window !== "undefined" && window.localStorage) {
    token = JSON.parse(localStorage.getItem("token"));
  }
  console.log("axios token ==== ", token);

  if (      
    token &&
    protectedRoutes?.some((route) => config.url?.startsWith(route))
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // else {
  //   window.location.href = "/auth/sign-in"
  // }
  return config;
});

export default axiosInstance;
