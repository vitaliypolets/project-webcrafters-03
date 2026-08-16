import multer from 'multer';

const storage = multer.memoryStorage();

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const articleUpload = multer({
  storage,

  limits: {
    fileSize: 1 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return callback(new Error('Only JPEG, PNG and WEBP images are allowed'));
    }

    callback(null, true);
  },
});
