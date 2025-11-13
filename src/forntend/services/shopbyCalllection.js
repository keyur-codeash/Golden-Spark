import Toast from "@/components/toastService";
import axiosInstance from "../lib/axiosClient";

export const fetchShopByCallection = async () => {
  try {
    const response = await axiosInstance.get("/product/shopobycallection");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(
        response?.data?.message || "Failed to fetch shop by callection details!"
      );
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};