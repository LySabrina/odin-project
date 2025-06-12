import { Router } from "express";
import { validateFolderForm } from "../middleware/validate.js";
import * as folderController from "../controllers/folderController.js";
/**
 * @file Handles routes dealing with folders and calling the appropriate folderController function to handle 
 * Example: /folder/* 
 */
const folderRoutes = Router();
folderRoutes.delete("/folder/:folder_id", folderController.deleteFolder);

folderRoutes.get("/folder/:folder_id", folderController.getFolder);

folderRoutes.post(
  "/createFolder",
  validateFolderForm(),
  folderController.postCreateFolder
);

export default folderRoutes;
