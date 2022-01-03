import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

export const photoFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|xls|xlsx|pdf)$/)) {
    cb(null, false);
  }
  cb(null, true);
};

export const fileUpload = multer({
  storage,
  fileFilter: photoFilter,
  limits: { fieldSize: 1024 * 1024 }
}).single('document');