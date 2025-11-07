import Toast from "@/components/toastService";
import axiosInstance from "../lib/axiosClient";

// Fetch blog
export const fetchBlog = async () => {
  try {
    const response = await axiosInstance.get("/blog");
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch blog.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};