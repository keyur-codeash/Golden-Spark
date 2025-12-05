import Toast from "@/components/toastService";
import axiosInstance from "@/forntend/lib/axiosClient";

// Fetch brand
export const fetchBrand = async () => {
  try {
    const response = await axiosInstance.get("/admin/brand");
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

export const addBrandData = async (body) => {
  try {
    const response = await axiosInstance.post("/admin/brand", body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add product brand.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

export const updateBrand = async (body) => {
  try {
    const response = await axiosInstance.put("/admin/brand/" + body._id, body);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update product brand.");
      return null;
    }
  } catch (error) {
    console.log("error===", error);
    
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await axiosInstance.delete("/admin/brand/" + id);

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to update product brand.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return false;
  }
};
