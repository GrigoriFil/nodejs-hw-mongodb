import multer from 'multer';
import path from 'node:path';

export const upload = multer({
  dest: path.join(process.cwd(), 'uploads'),
});