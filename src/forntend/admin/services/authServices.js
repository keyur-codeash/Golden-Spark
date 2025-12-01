// import { toast } from "sonner";
import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

//  sign-in
export const signIn = async (body) => {
  try {
    const response = await axiosInstance.post("/auth/sign-in/", body);
    
    if (response?.data?.isSuccess) {
      Toast.success(response.data.message);
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to sign-in.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  sign-up
export const signUp = async (body) => {
  try {
    const response = await axiosInstance.post("/auth/sign-up/", body);
    if (response?.data?.isSuccess) {
      Toast.success(response.data.message);
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to sign-up.");
      return null;
    }
  } catch (error) {
    
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  send-otp
export const sendOtp = async (body) => {
  try {
    const response = await axiosInstance.post("/auth/verify-mail", body);
    if (response?.data?.isSuccess) {
      Toast.success(response.data.message);
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to send otp.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  sverify-otp
export const veifyOtp = async (body) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", body);
    if (response?.data?.isSuccess) {
      Toast.success(response.data.message);
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to verify otp.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  forgot-password
export const forgotPassword = async (body) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", body);
    if (response?.data?.isSuccess) {
      Toast.success(response.data.message);
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to forgot password.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  socialLogin
export const socialLogin = async (body) => {
  try {
    const response = await axiosInstance.post("/auth/social-login", body);
    if (response?.data?.isSuccess) {
      Toast.success(response.data.message);
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to socialLogin.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
