"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src/middleware/upload.ts
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directory exists
const uploadDir = "uploads";
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// Define the disk storage engine with proper typings
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
        cb(null, uniqueName);
    }
});
// Export the configured upload middleware
exports.upload = (0, multer_1.default)({ storage });
