import Joi from "joi";
import mongoose, { Types } from "mongoose";

const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation");

const error = true;

export const addWishlistSchema = Joi.object({
  productId: objectId().required().messages({
    "any.required": "Product id is required",
    "any.invalid": "Product not found",
    "string.empty": "Product cannot be empty",
  }),
});
