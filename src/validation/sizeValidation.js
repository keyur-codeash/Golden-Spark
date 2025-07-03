// validations/SizeValidation.js
import SizeSchema from "@/model/sizeSchema";
import Joi from "joi";

export const updateSizeSchema = Joi.object({
  size: Joi.string().trim().required().messages({
    "string.base": "Size is string",
    "string.empty": "Size is required",
    "any.required": "Size is required",
  }),
});

export const addSizeSchema = Joi.object({
  size: Joi.string().trim().required().messages({
    "string.base": "Size is string",
    "string.empty": "Size is required",
    "any.required": "Size is required",
  }),
});

export const idParamSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "Size not found",
      "string.hex": "Size not found",
      "any.required": "Size is rquired",
    })
    .custom(async (value, helpers) => {
      console.log("value:", value);

      const findSize = await SizeSchema.findById(value);
      console.log("findSize:", findSize);

      if (!findSize) {
        return helpers.error("any.invalid", { message: "Size not found" });
      }
      return findSize;
    }),
});
