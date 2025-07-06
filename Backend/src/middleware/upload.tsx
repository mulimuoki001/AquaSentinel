// src/middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });
