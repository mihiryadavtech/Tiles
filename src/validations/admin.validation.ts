import { body, checkSchema } from 'express-validator';
const adminRegister = checkSchema({
  name: {
    isLength: {
      errorMessage: 'Name should be at least 3 char long',
      options: {
        min: 3,
      },
    },
    trim: true,
  },
  email: {
    isEmail: {
      errorMessage: 'Enter a proper email ',
    },
    trim: true,
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 8 char long',
      options: {
        min: 8,
      },
    },
    trim: true,
  },
});
const adminLogin = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Enter a proper email ',
    },
    trim: true,
  },
  password: {
    isLength: {
      errorMessage: 'Check the password entered password again',
      options: {
        min: 8,
      },
    },
    trim: true,
  },
});

export { adminRegister, adminLogin };
