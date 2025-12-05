import Toast from "@/components/toastService";
import axiosInstance from "@/forntend/lib/axiosClient";

// Fetch category
export const fetchCategory = async () => {
  try {
    const response = await axiosInstance.get("/admin/product/category");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch brand.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};


export const addCategoryData = async (body) => {
  try {
    const response = await axiosInstance.post("/admin/product/category", body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add product category.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

export const updateCategory = async (body) => {
  try {
    const response = await axiosInstance.post("/admin/product/category/"+ body._id, body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update product category.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};


export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete("/admin/product/category/"+ id);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update product category.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

