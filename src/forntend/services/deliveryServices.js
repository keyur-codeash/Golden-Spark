import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

// Contact Post
export const fetchDeliveryDetails = async (body) => {
  try {
    const response = await axiosInstance.get("/deliveryDetails", body);

    if (response?.data?.isSuccess) {

      return response.data;
    } else {
      Toast.error(
        response?.data?.message || "Failed to fetch delivery details."
      );
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
