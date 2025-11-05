import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

export const getFaqData = async () => {
  try {
    const response = await axiosInstance.get("/faq");
    return response.data;
  } catch (error) {
    Toast.error(error);
    return false;
  }
};
