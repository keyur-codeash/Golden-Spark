import * as Yup from "yup";

// Billing address validation
export const ProductCategory = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required."),
});
