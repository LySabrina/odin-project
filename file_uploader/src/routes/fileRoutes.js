import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import upload from "../utilities/upload.js";

const fileRoutes = Router();

fileRoutes.post(
  "/upload-file",
  upload.array("file", 3),
  fileController.postCreateFile
);

fileRoutes.get("/file/:file_id", fileController.getFile);
fileRoutes.delete("/file/:file_id", fileController.deleteFile);
export default fileRoutes;
