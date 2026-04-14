/**
 * Shared validation & sanitization helpers
 */

// Strip HTML tags and trim whitespace
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim();
};

// Check if value is a positive integer
export const isPositiveInt = (val) => {
  const num = Number(val);
  return Number.isInteger(num) && num > 0;
};

// Validate address fields
export const validateAddress = (body) => {
  const errors = [];
  const fields = ['address_line', 'city', 'state', 'zip'];

  for (const field of fields) {
    const val = body[field];
    if (!val || typeof val !== 'string' || sanitizeString(val).length === 0) {
      errors.push({ field, message: `${field.replace('_', ' ')} is required` });
    }
  }

  if (body.address_line && sanitizeString(body.address_line).length < 5) {
    errors.push({ field: 'address_line', message: 'Address must be at least 5 characters' });
  }

  if (body.zip && !/^[a-zA-Z0-9\s\-]{3,10}$/.test(sanitizeString(body.zip))) {
    errors.push({ field: 'zip', message: 'Invalid ZIP code format' });
  }

  if (body.city && !/^[a-zA-Z\s.\-']+$/.test(sanitizeString(body.city))) {
    errors.push({ field: 'city', message: 'City must contain only letters and spaces' });
  }

  if (body.state && sanitizeString(body.state).length < 2) {
    errors.push({ field: 'state', message: 'State must be at least 2 characters' });
  }

  return errors;
};

// Sanitize all string values in an object (shallow)
export const sanitizeBody = (obj) => {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key] = typeof val === 'string' ? sanitizeString(val) : val;
  }
  return result;
};
