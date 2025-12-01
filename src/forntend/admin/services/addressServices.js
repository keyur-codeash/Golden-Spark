import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

//  Create Address
export const createAddress = async (addressData = {}) => {
  try {
    const response = await axiosInstance.post("/address", addressData);
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

// Fetch Addresses
export const fetchAddress = async () => {
  try {
    const response = await axiosInstance.get("/address");
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

// fetch single address
export const fetchSingleAddress = async () => {
  try {
    const response = await axiosInstance.get("/address/selected");
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

// Update Address
export const updateAddress = async (updateData = {}) => {

  try {
    const response = await axiosInstance.put(`/address`, updateData);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Delete Address
export const deleteAddress = async (id) => {
  try {
    const response = await axiosInstance.delete(`/address?id=${id}`);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to delete address.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
