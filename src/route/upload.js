import express from "express";
import { uploadFile } from "../controller/upload.js";

const router = express.Router();
router.post("/upload", uploadFile);

export { router }