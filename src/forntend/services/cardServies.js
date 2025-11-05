import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

//  Create Card
export const createCard = async (cardData = {}) => {
  try {
    const response = await axiosInstance.post("/payment/card", cardData);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add card.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// Fetch Cards
export const fetchCard = async () => {
  try {
    const response = await axiosInstance.get("/payment/card");
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch cards.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// Update Card
export const updateCard = async (updateData = {}) => {
  try {
    const response = await axiosInstance.put(`/payment/card`, updateData);
    if (response?.data?.isSuccess) {
      Toast.success("Card updated successfully!");
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update card.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// Delete Card
export const deleteCard = async (id) => {
  try {
    const response = await axiosInstance.delete(`/payment/card?id=${id}`);
    if (response?.data?.isSuccess) {
      Toast.success("Card deleted successfully!");
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to delete card.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
