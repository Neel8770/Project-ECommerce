import Joi from 'joi';

export const createOrderSchema = Joi.object({
  // 1. Validate the Cart Items (Must be an array, must have at least 1 item)
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required().messages({ 'any.required': 'Product ID is required' }),
      name: Joi.string().required().messages({ 'any.required': 'Product name is required' }),
      price: Joi.number().min(0).required().messages({ 'any.required': 'Price is required' }),
      qty: Joi.number().min(1).required().messages({ 'number.min': 'Quantity must be at least 1' })
    })
  ).min(1).required().messages({
    'array.min': 'Your cart cannot be empty',
    'any.required': 'Cart items are required'
  }),

  shippingAddress: Joi.object({
    name: Joi.string().required().messages({ 'string.empty': 'Shipping name is required' }),
    mobile: Joi.string().required().messages({ 'string.empty': 'Mobile number is required' }),
    pincode: Joi.string().required().messages({ 'string.empty': 'Pincode is required' }),
    city: Joi.string().required().messages({ 'string.empty': 'City is required' }),
    state: Joi.string().required().messages({ 'string.empty': 'State is required' }),
    address: Joi.string().required().messages({ 'string.empty': 'Full address is required' }),
    landmark: Joi.string().allow('').optional() // Allow empty string for optional fields
  }).required().messages({
    'any.required': 'Shipping address is required'
  }),

  totalAmount: Joi.number().min(1).required().messages({
    'any.required': 'Total amount is required'
  }),
  idempotencyKey: Joi.string().required().messages({
    'any.required': 'Security key is missing from request'
  })
});