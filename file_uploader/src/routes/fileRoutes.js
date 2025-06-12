import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import upload from "../utilities/upload.js";

/**
 * @file fileRouter listens for endpoints and calls the appropriate fileController method to handle 
 * Handles all endpoints dealing with: /file/* 
 */		
const fileRoutes = Router();

fileRoutes.post(
  "/upload-file",
  upload.array("file", 3),
  fileController.postCreateFile
);

fileRoutes.get("/file/:file_id", fileController.getFile);
fileRoutes.delete("/file/:file_id", fileController.deleteFile);
export default fileRoutes;
