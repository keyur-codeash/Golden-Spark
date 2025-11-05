// src/services/orderService.js
import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

//  Create Order
export const createOrder = async (orderData = {}) => {
  try {
    const response = await axiosInstance.post("/order", orderData);

    if (response?.data?.isSuccess) {
      Toast.success(
        response.data.message || "Order has been space successfully!"
      );
      return response.data;
    } else {
      console.log("response", response.data);
      return response.data;
    }
  } catch (error) {
    Toast.error(
      error?.response?.data?.failedOrders[0].message || "Something went wrong."
    );
    return null;
  }
};

//  Fetch Order
export const fetchOrder = async (filter) => {
  try {
    const response = await axiosInstance.get("/order?status=" + filter);

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch orders.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Update Order
export const updateOrder = async (body) => {
  try {
    const response = await axiosInstance.put(`/order?id=${body._id}`, body);

    if (response?.data?.isSuccess) {
      Toast.success("Order updated successfully!");
      return response;
    } else {
      Toast.error(response?.data?.message || "Failed to update order.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Fetch Order
export const fetchSingleOrder = async (id) => {
  try {
    const response = await axiosInstance.get("/order/" + id);
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch orders.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

//  Update Order
export const cancelOrder = async (body) => {
  try {
    const response = await axiosInstance.put(`/order/cancel/`, body);

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to cancel order.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

export const orderCancellationReasons = async (body) => {
  try {
    const response = await axiosInstance.get(`/order/cancel/reason`, body);

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch order cancellation reasons.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};
