import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

export const getUserProfileData = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    console.log("response==================", response);
    
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to find wish list.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
