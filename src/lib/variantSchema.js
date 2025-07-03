export const variantValidationSchema = {
  size: "string|required",
  color: "string|required",
  price: "number|required|min:0",
  stock: "number|required|min:0",
};