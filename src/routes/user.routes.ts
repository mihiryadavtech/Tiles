import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import {
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
} from '../controller/user.controller';
import multer from 'multer';
import path from 'path';
import authenticateToken from '../middleware/auth';

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/user');
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

router.post(
  '/user/signup',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  [
    body('name').isLength({ min: 3 }).withMessage('Enter your Name'),
    body('profilePhoto', 'select an Image '),
    body('mobile')
      .isLength({ min: 10, max: 10 })
      .withMessage('Enter the proper Number'),
    body('email').toLowerCase().isEmail().withMessage('Enter proper Email'),
    body('password').isLength({ min: 8 }).withMessage('Enter proper Password'),
    body('country').isLength({ min: 3 }).withMessage('Enter proper Country'),
    body('state').isLength({ min: 3 }).withMessage('Enter proper State'),
    body('city').isLength({ min: 3 }).withMessage('Enter proper City'),
    body('gstNumber')
      .isLength({ min: 15, max: 15 })
      .withMessage('Enter proper GST Number'),
    body('companyName')
      .isLength({ min: 5, max: 100 })
      .withMessage('Enter proper Company Name'),
    body('companyAddress')
      .isLength({ min: 20, max: 200 })
      .withMessage('Enter proper Company Address'),
    body('companyWebsite')
      .isLength({ min: 5, max: 150 })
      .withMessage('Enter proper Company Website'),
    body('visitingCard').isEmpty().withMessage('Enter proper Visiting Card'),
    body('verificationDoc')
      .isEmpty()
      .withMessage('Enter proper Verification Document '),
    body('verified')
      .toLowerCase()
      .isBoolean()
      .withMessage('Enter proper Input for Verified'),
    body('disabled')
      .toLowerCase()
      .isBoolean()
      .withMessage('Enter proper Input for Disabled'),
    body('subrole').notEmpty().withMessage('Enter proper Input for subrole'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorArray: string[] = [];
      errors?.array().forEach((element) => {
        errorArray.push(element?.msg);
      });

      console.log(errorArray);
      return res.status(400).json({ Errors: errorArray });
    }
    return next();
  },
  registerUser
);

router.post('/user/login', loginUser);
router.get('/user', authenticateToken, getAllUser);

router.patch(
  '/user',
  authenticateToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  updateUser
);
router.delete('/user', authenticateToken, deleteUser);

//
//
//
//

export { router as userRouter };
