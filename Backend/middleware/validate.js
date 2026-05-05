const validate = (schema) => (req, res, next) => {
  // Validate the request body against the provided Joi schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // If validation fails, format the errors into a clean array of messages
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: errorMessage,
    });
  }

  // If validation passes, move to the actual controller
  next();
};

export default validate;