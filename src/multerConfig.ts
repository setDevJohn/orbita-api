import multer from "multer";
import path from "path";
import { AppError, HttpStatus } from "./helpers/appError";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const IMAGE_FOLDER_PATH = process.env.IMAGE_FOLDER_PATH

    if (!IMAGE_FOLDER_PATH) {
      throw new AppError(
        'Erro ao carregar variável de ambiente: IMAGE_FOLDER_PATH',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    cb(null, IMAGE_FOLDER_PATH); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // pega a extensão original (.png, .jpg etc.)
    const uniqueName = Date.now() + ext; 
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });