// src/middleware/upload.ts
import multer, { StorageEngine } from "multer";
import fs from "fs";
import { Request } from "express";

// Ensure upload directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Define the disk storage engine with proper typings
const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadDir);
    },
    filename: (_: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
        cb(null, uniqueName);
    }
});

// Export the configured upload middleware
export const upload = multer({ storage });
