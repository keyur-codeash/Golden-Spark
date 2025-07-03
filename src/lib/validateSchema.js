import Joi from "joi";

/**
 * Validates data against a Joi schema.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {Object} data - The data to validate (usually from request body).
 * @returns {{ value: any, error: string | null }}
 */
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return { value: null, error: message };
  }

  return { value, error: null };
};
