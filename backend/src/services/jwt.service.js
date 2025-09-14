import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function sign(payload, options = {}) {
  // creates a new token using payload , JWT_SECRET etc...
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...options });
}

export function verify(token) {
  // checks the token is valid or not 
  return jwt.verify(token, JWT_SECRET);
}