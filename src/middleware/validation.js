const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    req.body = value;
    next();
  };
};

const schemas = {
  register: Joi.object({
    name: Joi.string().required().max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  shortenUrl: Joi.object({
    originalUrl: Joi.string().uri().required(),
    customAlias: Joi.string().alphanum().min(3).max(20).optional(),
    title: Joi.string().max(100).optional(),
    description: Joi.string().max(500).optional(),
    expiresAt: Joi.date().min('now').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
  updateUrl: Joi.object({
    title: Joi.string().max(100).optional(),
    description: Joi.string().max(500).optional(),
    expiresAt: Joi.date().min('now').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

module.exports = { validateRequest, schemas };
