import { toast } from "sonner";

const Toast = {
  success: (msg) =>
    toast.success(msg, {
      style: {
        background: "#f9f4ee",
        color: "#795741",
        border: "1px solid #e0dcdc",
        padding: "16px",
        fontSize: "15px",
        borderRadius: "12px",
        boxShadow: "0px 0px 10px 0.5px #ad8b5c",
        fontWeight: "bold",
      },
      duration: 5000,
    }),
  error: (msg) =>
    toast.error(msg, {
      style: {
        background: "#f9f4ee",
        padding: "16px",
        fontSize: "15px",
        borderRadius: "12px",
        // boxShadow: "0px 0px 10px 0.5px #c06456",
        boxShadow: "#e9250763 0px 0px 10px 0.5px",
        fontWeight: "bold",
      },
      duration: 3000,
    }),
  info: (msg) => toast.info(msg),
  warn: (msg) => toast.warning(msg),
};

export default Toast;

// import { toast } from "sonner";s

// const Toast = {
//   success: (msg) =>
//     toast.success(msg, {
//       style: {
//         background: "#f9f4ee",
//         color: "#795741",
//         border: "1px solid #e0dcdc",
//         padding: "16px",
//         fontSize: "15px",
//         borderRadius: "12px",
//         boxShadow: "0px 0px 10px 0.5px #ad8b5c",
//       },
//       duration: 100000,
//     }),
//   error: (msg) => toast.error(msg),
//   info: (msg) => toast.info(msg),
//   warn: (msg) => toast.warning(msg),
// };

// export default Toast;

// // src/utils/toastService.js
// import { toast } from 'react-toastify';

// const Toast = {
//   success: (msg) => toast.success(msg),
//   error: (msg) => toast.error(msg),
//   info: (msg) => toast.info(msg),
//   warn: (msg) => toast.warn(msg),
// };

// export default Toast;
