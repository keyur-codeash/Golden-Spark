import axiosInstance from "../lib/axiosClient";
import Toast from "@/components/toastService";

export const getwishlistData = async (currentPage) => {
  currentPage = currentPage || 1;
  try {
    const response = await axiosInstance.get(
      "/product/wishlist?page=" + currentPage
    );
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to find wish list.");
      return null;
    }
  } catch (error) {
    return false;
  }
};

export const addWishlistData = async (body) => {
  try {
    const response = await axiosInstance.post("/product/wishlist", body);

    if (response.data.isSuccess) {
      Toast.success(
        response?.data?.message || "Product added to your wishlist."
      );
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add wishlist.");
      return null;
    }
  } catch (error) {
    if (
      error?.response?.data.isSuccess == false &&
      error?.response?.data?.message == "Authorization token missing"
    ) {
      return { token: false };
    }

    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

export const deleteWishlistData = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/product/wishlist?productId=${id}`
    );

    if (response.data.isSuccess) {
      Toast.success(
        response?.data?.message || "Product removed from wishlist successfully!"
      );

      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to remove wishlist.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};
