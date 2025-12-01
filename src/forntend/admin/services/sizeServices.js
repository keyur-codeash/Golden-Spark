import Toast from "@/components/toastService";
import axiosInstance from "../lib/axiosClient";

// Fetch size
export const fetchsize = async () => {
  try {
    const response = await axiosInstance.get("/size");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch size.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};