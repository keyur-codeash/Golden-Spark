import Joi from "joi";

export const privacyPolicyValidation = Joi.object({
  _id: Joi.string().optional().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),

  field: Joi.string().required().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),

  content: Joi.string().required().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),
});

export const sibscribeMailvalidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
});
