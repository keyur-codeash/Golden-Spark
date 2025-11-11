import Toast from "@/components/toastService";
import axiosInstance from "../lib/axiosClient";
import useToken from "../hooks/useToken";

// Fetch new arrival product
export const fetchNewArrivalProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/?isNewArrival=true");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(
        response?.data?.message || "Failed to fetch new arrival products!"
      );
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

// Fetch new product
export const fetchProducts = async (query, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axiosInstance.get(`/product/?limit=8&${query}`, {
      headers,
    });

    if (response.data.isSuccess) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

export const fetchSingleProduct = async (id, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get(`/product/${id}`, {
      headers,
    });

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch product!");
      return null;
    }
  } catch (error) {
    console.log(error.response.data);
    
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

export const fetchProductVariant = async (id, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get(`/variant?id=${id}`, {
      headers,
    });

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(
        response?.data?.message || "Failed to fetch product variant!"
      );
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};
