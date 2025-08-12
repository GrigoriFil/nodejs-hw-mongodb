import multer from 'multer';
import path from 'node:path';

const uploadDir = path.join(process.cwd(), 'uploads');

const multerConfig = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: multerConfig,
});