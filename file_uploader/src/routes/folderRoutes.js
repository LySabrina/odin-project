import { Router } from "express";
import { validateFolderForm } from "../middleware/validate.js";
import * as folderController from "../controllers/folderController.js";

const folderRoutes = Router();

folderRoutes.post(
  "/createFolder",
  validateFolderForm(),
  folderController.postCreateFolder
);

export default folderRoutes;
