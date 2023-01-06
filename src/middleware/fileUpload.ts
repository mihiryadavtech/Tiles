import { Router } from 'express';

import multer from 'multer';
import path from 'path';
import { AppError } from '../exceptions/errorException';

const router = Router();

const upload = (entity: string, uploadLimit: number, fileType: any = [[]]) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      return cb(
        null,
        `${entity}/${file.fieldname}_${Date.now()}${path.extname(
          file.originalname
        )}`
      );
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: uploadLimit },
    fileFilter(req, file, callback) {
      const pdfFields = ['pdf', 'verificationDoc'];

      if (pdfFields.includes(file.fieldname)) {
        const typeOfFile = file.mimetype;
        
        if (!fileType[0].includes(typeOfFile)) {
          callback(new AppError('Error occur during file upload', 400));
        } else {
          console.log('first');
          callback(null, true);
        }
      } else {
        const typeOfFile = file.mimetype;
        if (!fileType[1].includes(typeOfFile)) {
          callback(new AppError('Error occur during image upload', 400));
        } else {
          console.log('second');
          callback(null, true);
        }
      }
    },
  });
};
export { upload };
