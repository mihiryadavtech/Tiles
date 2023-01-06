import { checkSchema } from 'express-validator';
enum Status {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}
const createCatalogueValidation = checkSchema({
  name: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Name should be at least 3 char long',
    },
    trim: true,
  },
  description: {
    optional: true,
    isLength: {
      options: {
        min: 10,
        max: 100,
      },
    },
    trim: true,
    errorMessage: 'Enter a proper description',
  },
  isPrivate: {
    isBoolean: true,
    errorMessage: 'Enter proper value for is boolean',
  },
  status: {
    isIn: {
      options: [[Status.INREVIEW, Status.APPROVED, Status.REJECTED]],
    },
    errorMessage: 'Enter a proper status',
  },
  editCount:{
    isNumeric:true,
   errorMessage:'Enter a proper editCount' 
  }
});

export { createCatalogueValidation };
