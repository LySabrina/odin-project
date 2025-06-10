import { Router } from "express";
import { validateFolderForm } from "../middleware/validate.js";
import * as folderController from "../controllers/folderController.js";

const folderRoutes = Router();
folderRoutes.delete("/folder/:folder_id", folderController.deleteFolder);

folderRoutes.get("/folder/:folder_id", folderController.getFolder);

folderRoutes.post(
  "/createFolder",
  validateFolderForm(),
  folderController.postCreateFolder
);

export default folderRoutes;
