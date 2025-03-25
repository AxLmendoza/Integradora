/* src/routes/uploadRoutes.ts */

import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/subir", upload.single("file"), uploadFile);

export default router;
