import { Router } from "express";
import * as genreController from "../controller/genreController.js";
import { body } from "express-validator";
const genreRouter = Router();

genreRouter.get("/", genreController.getFormGenre);
genreRouter.post("/", body("genre").notEmpty(), genreController.addNewGenre);
genreRouter.delete("/:genre", genreController.deleteGenre);

export default genreRouter;