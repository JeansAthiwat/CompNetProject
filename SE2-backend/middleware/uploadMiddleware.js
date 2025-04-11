// uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// Use memory storage for file upload so the file is available in req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|zip/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extName) {
      return cb(null, true);
    }
    cb(new Error('Only .pdf, .doc, .docx, .ppt, .pptx, and .zip formats are allowed.'));
  }
});

export default upload;
