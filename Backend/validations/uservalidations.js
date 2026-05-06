import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'any.required': 'Name is a required field'
  }),
  email: Joi.string()
    .email({ 
      // Forces at least 'something.tld'
      minDomainSegments: 2, 
      // Forces the ending to be from this specific list
      tlds: { allow: ['com', 'net', 'org', 'in', 'io', 'gov'] } 
    })
    .required()
    .messages({
      "string.email": "Invalid email format. Please use .com, .net, .in, etc.",
      "string.empty": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is a required field'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('user', 'admin').optional() 
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Name must be at least 3 characters long'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email'
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('user', 'admin').optional() // In case an admin is editing a user's role
});

