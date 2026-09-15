export function validateSignup(req, res, next) {
  const { name, email, password, confirmPassword, role, acceptTerms } = req.body;
  const errors = {};

  // Name validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full Name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Work email is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid work email address.';
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  // Confirm Password validation
  if (confirmPassword === undefined || confirmPassword === null) {
    errors.confirmPassword = 'Confirm Password is required.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // Role validation
  const allowedRoles = ['PROJECT_MANAGER', 'SITE_ENGINEER'];
  if (!role) {
    errors.role = 'Please select a role (Project Manager or Site Engineer).';
  } else if (!allowedRoles.includes(role)) {
    errors.role = 'Invalid role selected. Must be PROJECT_MANAGER or SITE_ENGINEER.';
  }

  // Terms acceptance validation
  if (acceptTerms !== true && acceptTerms !== 'true') {
    errors.acceptTerms = 'You must accept the terms and conditions.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors,
    });
  }

  // Normalize inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
}
