import multer from "multer";
import fs from "fs";

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("uploads/payments")) fs.mkdirSync("uploads/payments");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/payments"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const uploadPayment = multer({ storage });


