import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  Originalprice: Joi.number().min(0).allow(null).optional(),
  category: Joi.string().required(),
  brand: Joi.string().required(), // ADDED: Joi now allows brand
  countInStock: Joi.number().min(0).required(), // ADDED: Joi now allows stock
  image: Joi.any().optional(), // Multer handles the actual file
  rating: Joi.number().min(0).max(5).optional(), 
  reviews: Joi.number().min(0).optional(),
  description: Joi.string().required(),
  badge: Joi.string().allow(null, '').optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  Originalprice: Joi.number().min(0).allow(null).optional(),
  category: Joi.string().optional(),
  brand: Joi.string().optional(), // ADDED
  countInStock: Joi.number().min(0).optional(), // ADDED
  image: Joi.any().optional(),
  description: Joi.string().optional(),
  badge: Joi.string().allow(null, '').optional()
});