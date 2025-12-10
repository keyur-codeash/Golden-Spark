import Joi from "joi";
import mongoose from "mongoose";

const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation");

export const addVariantSchema = Joi.object({
  productId: objectId().required().messages({
    "any.required": "Product is required",
    "any.invalid": "Product not found",
    "string.empty": "Product cannot be empty",
  }),

  size: objectId().required().messages({
    "any.required": "Size is required",
    "any.invalid": "Size not found",
    "string.empty": "Size cannot be empty",
  }),

  color: objectId().required().messages({
    "any.required": "Color is required",
    "any.invalid": "Color not found",
    "string.empty": "Color cannot be empty",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),

  // sku: Joi.string().trim().required().messages({
  //   "string.base": "SKU must be a string",
  //   "string.empty": "SKU cannot be empty",
  //   "any.required": "SKU is required",
  // }),
});

export const updateVariantSchema = Joi.object({
  _id: objectId().required().messages({
    "any.required": "Product is required",
    "any.invalid": "Product Variant not found",
    "string.empty": "Product cannot be empty",
  }),

  productId: objectId().required().messages({
    "any.required": "Product is required",
    "any.invalid": "Product not found",
    "string.empty": "Product cannot be empty",
  }),

  size: objectId().required().messages({
    "any.required": "Size is required",
    "any.invalid": "Size not found",
    "string.empty": "Size cannot be empty",
  }),

  color: objectId().required().messages({
    "any.required": "Color is required",
    "any.invalid": "Color not found",
    "string.empty": "Color cannot be empty",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),

  // sku: Joi.string().trim().required().messages({
  //   "string.base": "SKU must be a string",
  //   "string.empty": "SKU cannot be empty",
  //   "any.required": "SKU is required",
  // }),
}).unknown(true);;

export const getVariantSchema = Joi.object({
  productId: objectId().required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Product ID must be a valid ObjectId",
    "string.empty": "Product ID cannot be empty",
  }),
});

export const deleteVariantSchema = Joi.object({
  productId: objectId().required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Product ID must be a valid ObjectId",
    "string.empty": "Product ID cannot be empty",
  }),
});
