import { checkSchema } from 'express-validator';
const companyRegister = checkSchema({
  name: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Name should be at least 3 char long',
    },
    trim: true,
  },
  logo: {
    optional: true,
  },
  mobile: {
    isMobilePhone: {
      options: ['en-IN', { strictMode: true }],
    },
    errorMessage: 'Enter a proper phone number',
  },
  email: {
    isEmail: true,
    errorMessage: 'Enter a proper email ',
    trim: true,
  },
  password: {
    isLength: {
      options: {
        min: 8,
      },
    },
    errorMessage: 'Password should be at least 8 char long',
  },
  website: {
    optional: true,
    isURL: {
      options: {
        protocols: ['http', 'https'],
      },
    },
    errorMessage: 'Enter a proper website',
  },
  address: {
    optional: true,
    isLength: {
      options: {
        min: 1,
        max: 10,
      },
    },
    trim: true,
    errorMessage: 'Enter a proper address',
  },
  latitude: {
    optional: true,
    isFloat: {
      options: {
        min: -90,
        max: 90,
      },
    },
    trim: true,
    errorMessage: 'Enter a proper latitude ',
  },
  longitude: {
    optional: true,
    isFloat: {
      options: {
        min: -180,
        max: 180,
      },
    },
    trim: true,
    errorMessage: 'Enter a proper longitude ',
  },
  sponsored: {
    isBoolean: true,
    //  {
    //   options: { strict: true },
    // },
    errorMessage: 'Enter a proper input for sponsored ',
  },
  verified: {
    isBoolean: true,
    errorMessage: 'Enter a proper input for verified ',
  },
  disabled: {
    isBoolean: true,
    errorMessage: 'Enter a proper input for disabled ',
  },
  cta: {
    optional: true,

    errorMessage: 'Enter proper file',
  },
  subrole: {
    isNumeric: true,
    errorMessage: 'Enter proper subrole',
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
});

const companyLogin = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Enter a proper company email ',
    },
    trim: true,
  },
  password: {
    isLength: {
      errorMessage: 'Check the entered company password again',
      options: {
        min: 8,
      },
    },
    trim: true,
  },
});

export { companyRegister, companyLogin };
