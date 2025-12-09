import Toast from "@/components/toastService";
import axiosInstance from "@/forntend/lib/axiosClient";

// Fetch color
export const fetchColor = async () => {
  try {
    const response = await axiosInstance.get("/admin/color");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch color.");s
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

export const addColorData = async (body) => {
  try {
    const response = await axiosInstance.post("/admin/color", body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add Color.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

export const updateColor = async (id, body) => {
  try {
    const response = await axiosInstance.put("/admin/color/"+ id, body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update color.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};


export const deleteColor = async (id) => {
  try {
    const response = await axiosInstance.delete("/admin/color/"+ id);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to delete color.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

