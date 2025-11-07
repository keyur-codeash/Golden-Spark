import Joi from "joi";

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
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])")) 
    .pattern(new RegExp("(?=.*[!@#$%^&*])"))
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
    email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
  otp:  Joi.number()
  .integer()
  .min(1000) 
  .max(9999)  
  .required()
  .messages({
    "number.base": "OTP must be a number",
    "number.min": "OTP must be exactly 4 digits",
    "number.max": "OTP must be exactly 4 digits",
    "any.required": "OTP is required",
  })
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
    .pattern(new RegExp("(?=.*[a-z])")) 
    .pattern(new RegExp("(?=.*[A-Z])")) 
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp("(?=.*[!@#$%^&*])"))
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