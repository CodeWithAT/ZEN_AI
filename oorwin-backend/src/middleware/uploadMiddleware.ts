import multer from 'multer';
import path from 'path';

// Store file in memory so we can read the text buffer for AI parsing
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only PDFs and Word documents are allowed'));
    }
    cb(null, true);
  }
});