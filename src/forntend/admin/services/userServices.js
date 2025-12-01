import Toast from "@/components/toastService";
import axiosInstance from "@/forntend/lib/axiosClient";

export const getAllUsers = async (search = "", page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/admin/users`, {
      params: { search, page, limit },
    });

    if (response.data.isSuccess) {
      return response.data;
    } else {
      Toast.error(response?.data?.message || "Failed to find users.");
      return null;
    }
  } catch (error) {
    Toast.error(error?.response?.data?.message || "Something went wrong.");
    return null;
  }
};


// import Toast from "@/components/toastService";
// import axiosInstance from "@/forntend/lib/axiosClient";

// export const getAllUsers = async (search = "", page = 1, limit = 10) => {


//     console.log("page===================", page);
    
//   try {
//     const response = await axiosInstance.get(`/admin/users`, {
//       params: {
//         search,
//         page,
//         limit,
//       },
//     });

    

//     if (response.data.isSuccess) {
//       return response.data;
//     } else {
//       Toast.error(response?.data?.message || "Failed to find users.");
//       return null;
//     }
//   } catch (error) {
//     console.log(error);
    
//     Toast.error(error?.response?.data?.message || "Something went wrong.");
//     return null;
//   }
// };
