import * as Yup from "yup";

// Billing address validation
export const ProductCategory = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required."),
});

export const ProductBrand = Yup.object().shape({
  name: Yup.string().trim().required("Brand name is required."),
});

export const ProductColor = Yup.object().shape({
  name: Yup.string().trim().required("Color name is required."),
  color: Yup.string().trim().required("color is required."),
});

export const ProductSizes = Yup.object().shape({
  size: Yup.string().trim().required("Size is required."),
});
