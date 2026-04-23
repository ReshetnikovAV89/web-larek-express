import path from "path";
import multer from "multer";
import { faker } from "@faker-js/faker";

const { UPLOAD_PATH_TEMP = "temp" } = process.env;

const allowedMimeTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/svg+xml",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, `../../${UPLOAD_PATH_TEMP}`));
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${faker.string.alphanumeric(8)}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Invalid file type"));
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
