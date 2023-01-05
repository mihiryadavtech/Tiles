import { checkSchema } from 'express-validator';
enum Role {
  BUYER = 1,
  SELLER = 2,
}
enum Doc {
  ADHAAR = 1,
  PAN_CARD = 2,
}

const userRegister = checkSchema({
  name: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Name should be at least 3 char long',
    },
    trim: true,
  },

  mobile: {
    isMobilePhone: {
      options: ['en-IN', { strictMode: true }],
    },
    errorMessage: 'Enter a proper phone number',
  },
  waMobile: {
    optional: true,
    isMobilePhone: {
      options: ['en-IN', { strictMode: true }],
    },
    errorMessage: 'Enter a proper whatApp number',
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
  country: {
    isLength: {
      options: {
        min: 3,
      },
    },
    trim: true,
    errorMessage: 'Enter the name of the country',
  },
  state: {
    isLength: {
      options: {
        min: 3,
      },
    },
    trim: true,
    errorMessage: 'Enter the name of the state',
  },
  city: {
    isLength: {
      options: {
        min: 3,
      },
    },
    trim: true,
    errorMessage: 'Enter the name of the city',
  },
  role: {
    isIn: {
      options: [[Role.BUYER, Role.SELLER]],
    },
    trim: true,
    errorMessage: 'Enter the name of the city',
  },
  gstNumber: {
    isFloat: {
      options: {
        min: 15,
        max: 15,
      },
    },
    trim: true,
    errorMessage: 'Enter the name of the city',
  },
  companyName: {
    isLength: {
      options: {
        min: 5,
      },
    },
    trim: true,
    errorMessage: 'Enter the Company Name',
  },
  companyAddress: {
    isLength: {
      options: {
        min: 10,
      },
    },
    trim: true,
    errorMessage: 'Enter the Company Name',
  },
  companyWebsite: {
    optional: true,
    isURL: {
      options: {
        protocols: ['http', 'https'],
      },
    },
    errorMessage: 'Enter a proper website',
  },
  visitingCard: {
    isIn: {
      options: [[Doc.ADHAAR, Doc.PAN_CARD]],
    },
    trim: true,
    errorMessage: 'Enter the name of the city',
  },
  verified: {
    isBoolean: true,
    errorMessage: 'Enter a proper input for verified ',
  },
  disabled: {
    isBoolean: true,
    errorMessage: 'Enter a proper input for disabled ',
  },
});

export { userRegister };
