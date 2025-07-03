// validations/colorValidation.js
import colorSchema from "@/model/colorSchema";
import Joi from "joi";

export const updateColorSchema = Joi.object({
  color: Joi.string().trim().required().messages({
    "string.base": "Color is string",
    "string.empty": "Color is required",
    "any.required": "Color is required",
  }),
});

export const addColorSchema = Joi.object({
  color: Joi.string().trim().required().messages({
    "string.base": "Color is string",
    "string.empty": "Color is required",
    "any.required": "Color is required",
  }),
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
      console.log("value:", value);

      const findColor = await colorSchema.findById(value);
      console.log("findColor:", findColor);

      if (!findColor) {
        return helpers.error("any.invalid", { message: "Color not found" });
      }
      return findColor;
    }),
});
