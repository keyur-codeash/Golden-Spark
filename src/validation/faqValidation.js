import Joi from "joi";

export const addfaqValidation = Joi.object({
  question: Joi.string().required().messages({
    "string.base": "Question must be a text string.",
    "string.empty": "Question is required.",
    "any.required": "Question is required.",
  }),

  answer: Joi.string().required().messages({
    "string.base": "Answer must be a text string.",
    "string.empty": "Answer is required.",
    "any.required": "Answer is required.",
  }),
});
