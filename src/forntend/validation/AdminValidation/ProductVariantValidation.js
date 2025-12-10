import * as Yup from "yup";

export const productVaraintValidation = Yup.object().shape({
  price: Yup.number().required("Price is required."),
  stock: Yup.number().required("Stock is required."),
  size: Yup.string().required("Size is required."),
  color: Yup.string().required("Color is required."),
});
