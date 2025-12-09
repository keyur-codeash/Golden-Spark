import SizeSchema from "@/model/sizeSchema";
import Joi, { optional } from "joi";

export const updateSizeSchema = Joi.object({
  _id : Joi.optional(),
  size: Joi.string().trim().required().messages({
    "string.base": "Size is string",
    "string.empty": "Size is required",
    "any.required": "Size is required",
  }),
  status: Joi.optional(),
});

export const addSizeSchema = Joi.object({
  size: Joi.string().trim().required().messages({
    "string.base": "Size is string",
    "string.empty": "Size is required",
    "any.required": "Size is required",
  }),
  status: Joi.boolean().optional(),
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
      const findSize = await SizeSchema.findById(value);
      if (!findSize) {
        return helpers.error("any.invalid", { message: "Size not found" });
      }
      return findSize;
    }),
});
