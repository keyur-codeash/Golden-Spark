import Joi from "joi";
import { objectId } from "./objectIdValidation";

export const addSOrderValidation = Joi.object({
  user: objectId().required().messages({
    "any.required": "User ID is required.",
    "string.empty": "User ID cannot be empty.",
    "any.invalid": "Invalid User ID.",
  }),

  productId: objectId().required().messages({
    "any.required": "Product ID is required.",
    "string.empty": "Product ID cannot be empty.",
    "any.invalid": "Invalid Product ID.",
  }),

  variantId: objectId().required().messages({
    "any.required": "Variant ID is required.",
    "string.empty": "Variant ID cannot be empty.",
    "any.invalid": "Invalid Variant ID.",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),

  deliveryFee: Joi.number().min(0).optional().messages({
    "number.base": "Delivery fee must be a number.",
    "number.min": "Delivery fee cannot be negative.",
  }),

  tax: Joi.number().min(0).required().messages({
    "number.base": "Tax must be a number.",
    "number.min": "Tax cannot be negative.",
    "any.required": "Tax is required.",
  }),

  total: Joi.number().min(0).optional(),
  addressId: objectId().required().messages({
    "any.required": "Address ID is required.",
    "string.empty": "Address ID cannot be empty.",
    "any.invalid": "Invalid Address ID.",
  }),

  paymentMethod: Joi.string()
    .valid("Cash", "Card", "UPI", "PayPal")
    .required()
    .messages({
      "any.only": "Payment method must be one of: Cash, Card, UPI, PayPal.",
      "any.required": "Payment method is required.",
      "string.empty": "Payment method cannot be empty.",
    }),

  cancel: Joi.number().valid(0, 1).default(0).messages({
    "number.base": "Cancel must be a number (0 or 1).",
    "any.only": "Cancel must be either 0 (not cancelled) or 1 (cancelled).",
  }),

  cancelReason: Joi.string().allow("").optional().messages({
    "string.base": "Cancel reason must be a string.",
  }),

  status: Joi.string()
    .valid("Pending", "Confirmed", "Shipped", "Delivered", "Cancelled")
    .default("Pending")
    .messages({
      "any.only":
        "Status must be one of: Pending, Confirmed, Shipped, Delivered, Cancelled.",
    }),
});