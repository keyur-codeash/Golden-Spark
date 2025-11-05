import Toast from "@/components/toastService";
import axiosInstance from "../lib/axiosClient";

// Fetch color
export const fetchColor = async () => {
  try {
    const response = await axiosInstance.get("/color");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch color.");s
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};