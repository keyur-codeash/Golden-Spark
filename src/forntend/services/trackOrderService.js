import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

//  track Order
export const fetchTrackOrder = async (id) => {
  try {
    const response = await axiosInstance.get(`/order/track?orderId=${id}`);
  
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch track orders.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Update Order
export const updateTrackOrder = async (body) => {
  try {
    const response = await axiosInstance.put(`/order/track`, body);
    if (response?.isSuccess) {
      Toast.success("Track order updated successfully!");
      return response;
    } else {
      Toast.error(response?.data?.message || "Failed to update track order.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
