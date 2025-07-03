import Joi from "joi";
import { objectId } from "./objectIdValidation";

export const addAddressValidation = Joi.object({
  user: objectId().required().messages({
    "any.required": "User ID is required.",
    "string.empty": "User ID cannot be empty.",
    "any.invalid": "User not found",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),

  type: Joi.string().required().messages({
    "any.required": "Type is required",
    "string.empty": "Type cannot be empty",
  }),

  country: Joi.string().required().messages({
    "string.empty": "Country cannot be empty",
    "any.required": "Country is required",
  }),

  firstName: Joi.string().required().messages({
    "string.empty": "First name cannot be empty",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().required().messages({
    "string.empty": "Last name cannot be empty",
    "any.required": "Last name is required",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address cannot be empty",
    "any.required": "Address is required",
  }),

  apartment: Joi.string().allow("", null).optional(),

  city: Joi.string().required().messages({
    "string.empty": "City cannot be empty",
    "any.required": "City is required",
  }),

  state: Joi.string().required().messages({
    "string.empty": "State cannot be empty",
    "any.required": "State is required",
  }),

  zipCode: Joi.string().required().messages({
    "string.empty": "Zip code cannot be empty",
    "any.required": "Zip code is required",
  }),

  isDefault: Joi.boolean().required().messages({
    "boolean.base": "isDefault must be true or false",
    "any.required": "isDefault is required",
  }),
});

export const editAddressValidation = Joi.object({
  _id: objectId().required().messages({
    "any.required": "Address ID is required.",
    "string.empty": "Address ID cannot be empty.",
    "any.invalid": "Address not found",
  }),

  user: objectId().required().messages({
    "any.required": "User ID is required.",
    "string.empty": "User ID cannot be empty.",
    "any.invalid": "User not found",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),

  type: Joi.string().required().messages({
    "any.required": "Type is required",
    "string.empty": "Type cannot be empty",
  }),

  country: Joi.string().required().messages({
    "string.empty": "Country cannot be empty",
    "any.required": "Country is required",
  }),

  firstName: Joi.string().required().messages({
    "string.empty": "First name cannot be empty",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().required().messages({
    "string.empty": "Last name cannot be empty",
    "any.required": "Last name is required",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address cannot be empty",
    "any.required": "Address is required",
  }),

  apartment: Joi.string().allow("", null).optional(),

  city: Joi.string().required().messages({
    "string.empty": "City cannot be empty",
    "any.required": "City is required",
  }),

  state: Joi.string().required().messages({
    "string.empty": "State cannot be empty",
    "any.required": "State is required",
  }),

  zipCode: Joi.string().required().messages({
    "string.empty": "Zip code cannot be empty",
    "any.required": "Zip code is required",
  }),

  isDefault: Joi.boolean().required().messages({
    "boolean.base": "isDefault must be true or false",
    "any.required": "isDefault is required",
  }),
});