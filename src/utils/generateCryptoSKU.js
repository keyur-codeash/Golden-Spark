const crypto = require("crypto");

export const generateCryptoSKU = (prefix = "ITEM") => {
  const random = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `${prefix}-${random}`;
};
