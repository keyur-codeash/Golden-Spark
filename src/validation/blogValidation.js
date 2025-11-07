import Joi from "joi";
import { objectId } from "./objectIdValidation";

export const addBlogValidation = Joi.object({
  heading: Joi.string().required().messages({
    "string.base": "Heading must be a text string.",
    "string.empty": "Heading is required.",
    "any.required": "Heading is required.",
  }),
  content: Joi.string().required().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),
  image: Joi.string().required().messages({
    "string.empty": "Image is required.", 
    "any.required": "Image is required.",
  }),
});

export const editBlogValidation = Joi.object({
  _id: objectId().required().messages({
    "any.required": "Blog ID is required.",
    "string.empty": "Blog ID cannot be empty.",
    "any.invalid": "Invalid Blog ID. Must be a valid MongoDB ObjectId.",
  }),
  heading: Joi.string().required().messages({
    "string.base": "Heading must be a text string.",
    "string.empty": "Heading is required.",
    "any.required": "Heading is required.",
  }),
  content: Joi.string().required().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),
  image: Joi.string().required().messages({
    "string.empty": "Image is required.",
    "any.required": "Image is required.",
  }),
});

export const deleteBlogValidation = Joi.object({
  id: objectId().required().messages({
    "any.required": "Blog ID is required.",
    "string.empty": "Blog ID cannot be empty.",
    "any.invalid": "Invalid Blog ID. Must be a valid MongoDB ObjectId.",
  }),
});
