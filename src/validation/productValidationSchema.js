import Joi from "joi";

export const productValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),

  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),

  brand: Joi.string().required().messages({
    "string.base": "Brand must be a string",
    "string.empty": "Brand is required",
    "any.required": "Brand is required",
  }),

  description: Joi.string().trim().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),

  sku: Joi.string().required().messages({
    "string.base": "SKU must be a string",
    "string.empty": "SKU is required",
    "any.required": "SKU is required",
  }),

  stock: Joi.number().required().messages({
    "number.base": "Stock must be a number",
    "any.required": "Stock is required",
  }),
}).unknown();