import { checkSchema } from 'express-validator';

const createSubroleValidation= checkSchema({
  name: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Name should be at least 3 char long',
    },
    trim: true,
  },
  slug: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Enter proper slug',
    },
    trim: true,
  },
  isDeleted: {
    isBoolean: true,
    errorMessage: 'Enter a proper input for isDeleted ',
  },
  disabled: {
    isBoolean: true,
    errorMessage: 'Enter a proper input for disabled ',
  },
});

export { createSubroleValidation };
