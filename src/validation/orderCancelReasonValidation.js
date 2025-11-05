import Joi from "joi";

export const addOrderCancelreasonValidation = Joi.object({
  reason: Joi.string().required().messages({
    "string.base": "Cancel reason must be a text string.",
    "string.empty": "Cancel reason is required.",
  }),
});

export const orderCancelValidation = Joi.object({
  _id: Joi.number().required().messages({
    // "string.base": "Order ID must be a text string.",
    "string.empty": "Order ID is required.",
  }),
  cancelReason: Joi.string().required().trim().messages({
    // "string.base": "Cancel reason must be a text string.",
    "string.empty": "Cancel reason is required.",
  }),

  cancelDescription: Joi.string().optional().allow("").trim().messages({
    // "string.base": "Cancel description must be a text string.",
  }),
});
