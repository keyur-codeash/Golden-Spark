import Toast from "@/components/toastService";
import axiosInstance from "../lib/axiosClient";

// Fetch about
export const fetchAbout = async () => {
  try {
    const response = await axiosInstance.get("/about");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.message || "Failed to fetch about.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};