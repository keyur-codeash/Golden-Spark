import Toast from "@/components/toastService";
import axiosInstance from "@/forntend/lib/axiosClient";

// Fetch size
export const fetchSize = async () => {
  try {
    const response = await axiosInstance.get("/admin/size");
    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch size.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};

// add size
export const addSizeData = async (body) => {
  try {
    const response = await axiosInstance.post("/admin/size", body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add size.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

// update size
export const updateSize = async (id, body) => {
  try {
    const response = await axiosInstance.put("/admin/size/"+id, body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update size.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

// delete size
export const deleteSize = async (id) => {
  try {
    const response = await axiosInstance.delete("/admin/size/" + id);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to delete size.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};
