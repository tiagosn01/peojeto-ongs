import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const storageTypes = {
  local: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        return cb(null, file.key);
      });
    },
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'upload-helppet',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        return cb(null, fileName);
      });
    },
  }),
};

export default {
  storage: storageTypes.s3,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido.'));
    }
  },
};
