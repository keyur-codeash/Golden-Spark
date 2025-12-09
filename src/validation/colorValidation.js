import colorSchema from "@/model/colorSchema";
import Joi from "joi";

export const updateColorSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Color name is string",
    "string.empty": "Color name is required",
    "any.required": "Color name is required",
  }),
  color: Joi.string().trim().required().messages({
    "string.base": "Color is string",
    "string.empty": "Color is required",
    "any.required": "Color is required",
  }),
  status: Joi.optional(),
});

export const addColorSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Color name is string",
    "string.empty": "Color name is required",
    "any.required": "Color name is required",
  }),
  color: Joi.string().trim().required().messages({
    "string.base": "Color is string",
    "string.empty": "Color is required",
    "any.required": "Color is required",
  }),
  status: Joi.optional(),
});

export const idParamSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "Color not found",
      "string.hex": "Color not found",
      "any.required": "Color is rquired",
    })
    .custom(async (value, helpers) => {
      const findColor = await colorSchema.findById(value);

      if (!findColor) {
        return helpers.error("any.invalid", { message: "Color not found" });
      }
      return findColor;
    }),
});
