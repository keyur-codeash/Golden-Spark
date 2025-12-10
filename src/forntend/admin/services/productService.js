import Toast from "@/components/toastService";
import axiosInstance from "@/forntend/lib/axiosClient";

// Fetch new arrival product
export const fetchNewArrivalProducts = async () => {
  try {
    const response = await axiosInstance.get(
      "/admin/product/?isNewArrival=true"
    );
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

    const response = await axiosInstance.get(
      `/admin/product?$limit=${query.limit || 8}&page=${query.page || 1}`,
      {
        headers,
      }
    );

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

// Fetch new product
export const addProduct = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/admin/product", data);

    if (response?.data?.isSuccess) {
      Toast.success(
        response.data.message || "Order has been space successfully!"
      );
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("error=====", error);

    Toast.error(
      error?.response?.data?.failedOrders[0].message || "Something went wrong."
    );
    return null;
  }
};

// Fetch new product
export const updateProduct = async (id, data = {}) => {
  try {
    const response = await axiosInstance.put("/admin/product/" + id, data);

    if (response?.data?.isSuccess) {
      Toast.success(
        response.data.message || "Order has been space successfully!"
      );
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("error=====", error);

    Toast.error(
      error?.response?.data?.failedOrders[0].message || "Something went wrong."
    );
    return null;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete("/admin/product/" + id);

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log("error=====", error);

    Toast.error(
      error?.response?.data?.failedOrders[0].message || "Something went wrong."
    );
    return null;
  }
};

// Fetch Single Product
export const fetchSingleProduct = async (id, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get(`/admin/product/${id}`, {
      headers,
    });

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to fetch product!");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

export const fetchProductVariant = async (id) => {
  try {
    // const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get(
      `/admin/product/variants/?productId=${id}`
    );
 console.log("response========", response.data , response.data.isSuccess);
 
    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

export const addProductVariant = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin/product/variants`, data);

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add product variant!");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

export const updateProductVariant = async (data) => {
  try {
    const response = await axiosInstance.put(`/admin/product/variants`, data);

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add product variant!");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};

export const deleteProductVariant = async (id, token) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/product/variants?variantId=` + id
    );

    if (response?.data?.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to add product variant!");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong!");
    return null;
  }
};
