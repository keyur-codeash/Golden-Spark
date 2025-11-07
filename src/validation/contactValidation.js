import Joi from "joi";

export const contactValidation = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name cannot be empty",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().required().messages({
    "string.empty": "Last name cannot be empty",
    "any.required": "Last name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),

  message: Joi.string().required().messages({
    "string.empty": "Address cannot be empty",
    "any.required": "Address is required",
  }),
});