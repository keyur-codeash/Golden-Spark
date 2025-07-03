// File: src/utils/validation/authValidation.js

import Joi from "joi";

//sign up validaton

export const signUpSchema = Joi.object({
  userName: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp("(?=.*[a-z])")) // lowercase
    .pattern(new RegExp("(?=.*[A-Z])")) // uppercase
    .pattern(new RegExp("(?=.*[0-9])")) // number
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // special char
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
});

// sign in
export const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
});

// verify email
export const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
});

// verify otp
export const otpSchema = Joi.object({
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 4 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
      "string.empty": "OTP cannot be empty",
    }),
});

// forgot password validation
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .pattern(new RegExp("(?=.*[a-z])")) // at least one lowercase
    .pattern(new RegExp("(?=.*[A-Z])")) // at least one uppercase
    .pattern(new RegExp("(?=.*[0-9])")) // at least one digit
    .pattern(new RegExp("(?=.*[!@#$%^&*])")) // at least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
      "any.required": "Password is required",
    }),

  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),
});
