import { body } from 'express-validator';
const adminSchema = [
  body('name').isLength({ min: 3 }).trim().withMessage('Enter proper Name'),
  body('email').isEmail().toLowerCase().withMessage('Enter proper Email'),
  body('password').isLength({ min: 8 }).withMessage('Enter proper Password'),
];
export { adminSchema };
