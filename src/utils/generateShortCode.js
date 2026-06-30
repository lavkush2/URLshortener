const { customAlphabet } = require('nanoid');

// Alphabet without ambiguous characters
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const codeLength = process.env.SHORT_CODE_LENGTH || 6;
const nanoid = customAlphabet(alphabet, codeLength);

/**
 * Generate a unique short code
 * @returns {string} Short code
 */
const generateShortCode = () => {
  return nanoid();
};

/**
 * Generate custom short code (validate format)
 * @param {string} alias - Custom alias
 * @returns {boolean} Is valid
 */
const isValidAlias = (alias) => {
  const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return aliasRegex.test(alias);
};

module.exports = {
  generateShortCode,
  isValidAlias,
};
