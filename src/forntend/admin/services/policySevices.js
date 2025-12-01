import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

//  Add or Update Privacy
export const AddorUpdatePrivacy = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/privacy-policy", data);
    if (response?.data?.isSuccess) {
      Toast.success("Address Added successfully!");
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to create address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// get Privacy    
export const fetchPrivacy = async () => {
  try {
    const response = await axiosInstance.get("/privacy-policy");
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Add or Update Privacy
export const AddorUpdatetermsAndCondittons = async (addressData = {}) => {
  try {
    const response = await axiosInstance.post("/privecy-policy", addressData);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to create address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// get Privacy
export const fetchtermsAndCondittons = async () => {
  try {
    const response = await axiosInstance.get("/terms-conditions");
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Add or Update Privacy
export const AddorUpdateRefund = async (addressData = {}) => {
  try {
    const response = await axiosInstance.post("/refund-policy", addressData);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to create address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// get Privacy
export const fetchRefundPolicy = async () => {
  try {
    const response = await axiosInstance.get("/refund-policy");
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

export const subcribMail = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/subscribe_mail", data);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to create address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
