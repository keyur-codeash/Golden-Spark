import Joi from "joi";
import { objectId } from "./objectIdValidation";

export const addCardValidation = Joi.object({
  user: objectId().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID cannot be empty",
    "any.invalid": "Invalid User ID. Must be a valid MongoDB ObjectId",
  }),
  cardName: Joi.string().required().messages({
    "string.base": "Card Name must be a text string",
    "string.empty": "Card Name is required",
    "any.required": "Card Name is required",
  }),
  cardNumber: Joi.number().required().messages({
    "string.base": "Card Number must be a number",
    "string.empty": "Card Number is required",
    "any.required": "Card Number is required",
  }),
  cardExpirationDate: Joi.string().required().messages({
    "string.base": "Expiration Date must be a text string",
    "string.empty": "Expiration Date is required",
    "any.required": "Expiration Date is required",
  }),
  cvv: Joi.number().required().messages({
    "string.base": "CVV must be a number",
    "string.empty": "CVV is required",
    "any.required": "CVV is required",
  }),
});

export const editCardValidation = Joi.object({
  _id: objectId().required().messages({
    "any.required": "Card ID is required",
    "string.empty": "Card ID cannot be empty",
    "any.invalid": "Invalid Card ID. Must be a valid MongoDB ObjectId",
  }),
    user: objectId().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID cannot be empty",
    "any.invalid": "Invalid User ID. Must be a valid MongoDB ObjectId",
  }),
  cardName: Joi.string().required().messages({
    "string.base": "Card Name must be a text string",
    "string.empty": "Card Name is required",
    "any.required": "Card Name is required",
  }),
  cardNumber: Joi.number().required().messages({
    "string.base": "Card Number must be a Number",
    "string.empty": "Card Number is required",
    "any.required": "Card Number is required",
  }),
  cardExpirationDate: Joi.string().required().messages({
    "string.base": "Expiration Date must be a text string",
    "string.empty": "Expiration Date is required",
    "any.required": "Expiration Date is required",
  }),
  cvv: Joi.number().required().messages({
    "string.base": "CVV must be a number",
    "string.empty": "CVV is required",
    "any.required": "CVV is required",
  }),
});

export const deleteCardValidation = Joi.object({
  id: objectId().required().messages({
    "any.required": "Card ID is required",
    "string.empty": "Card ID cannot be empty",
    "any.invalid": "Invalid Card ID. Must be a valid MongoDB ObjectId",
  }),
});
