import Joi from "joi";
import { objectId } from "./objectIdValidation";

export const addAboutValidation = Joi.object({
  heading: Joi.string().required().messages({
    "string.base": "Heading must be a text string.",
    "string.empty": "Heading is required.",
    "any.required": "Heading is required.",
  }),
  sub_heading: Joi.string().required().messages({
    "string.base": "Sub heading must be a text string.",
    "string.empty": "Sub heading required.",
    "any.required": "Sub heading required.",
  }),
  content: Joi.string().required().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),
});

export const editAboutValidation = Joi.object({
  _id: objectId().required().messages({
    "any.required": "About ID is required.",
    "string.empty": "About ID cannot be empty.",
    "any.invalid": "Invalid About ID. Must be a valid MongoDB ObjectId.",
  }),
  heading: Joi.string().required().messages({
    "string.base": "Heading must be a text string.",
    "string.empty": "Heading is required.",
    "any.required": "Heading is required.",
  }),
  sub_heading: Joi.string().required().messages({
    "string.base": "Sub heading must be a text string.",
    "string.empty": "Sub heading required.",
    "any.required": "Sub heading required.",
  }),
  content: Joi.string().required().messages({
    "string.base": "Content must be a text string.",
    "string.empty": "Content is required.",
    "any.required": "Content is required.",
  }),
});

export const deleteAboutValidation = Joi.object({
  id: objectId().required().messages({
    "any.required": "About ID is required.",
    "string.empty": "About ID cannot be empty.",
    "any.invalid": "Invalid About ID. Must be a valid MongoDB ObjectId.",
  }),
});
